import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FileState, GoogleAIFileManager } from '@google/generative-ai/server';
import { ConfigService } from '@nestjs/config';
import { StateGraph, Annotation, END } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export interface MeetingSummary {
  transcription: string;
  summary: {
    keyPoints: string[];
    decisions: string[];
    followUps: string[];
    sentiment: string;
  };
  embedding: number[];
  chunks?: { content: string; embedding: number[] }[];
}

interface JsonResult {
  keyPoints?: string[];
  decisions?: string[];
  followUps?: string[];
  sentiment?: string;
}

const MeetingStateAnnotation = Annotation.Root({
  transcription: Annotation<string>(),
  cleanedTranscript: Annotation<string>(),
  keyPoints: Annotation<string[]>(),
  decisions: Annotation<string[]>(),
  followUps: Annotation<string[]>(),
  sentiment: Annotation<string>(),
});

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private fileManager: GoogleAIFileManager;
  private model: ChatGoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) throw new Error('GOOGLE_API_KEY is not set');

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.fileManager = new GoogleAIFileManager(apiKey);

    this.model = new ChatGoogleGenerativeAI({
      apiKey,
      model: 'gemini-2.5-flash',
      temperature: 0.2,
    });
  }

  /* =========================================================
     PUBLIC ENTRY POINT (REQUIRED)
  ========================================================= */

  async processAudioFile(
    filePath: string,
    mimeType: string,
  ): Promise<MeetingSummary> {
    let uploadedFileName: string | null = null;

    try {
      // 1️⃣ Upload audio
      const upload = await this.fileManager.uploadFile(filePath, {
        mimeType,
        displayName: 'Meeting Audio',
      });

      uploadedFileName = upload.file.name;

      let file = await this.fileManager.getFile(upload.file.name);
      while (file.state === FileState.PROCESSING) {
        await new Promise((r) => setTimeout(r, 1000));
        file = await this.fileManager.getFile(upload.file.name);
      }

      if (file.state === FileState.FAILED) {
        throw new Error('Audio processing failed');
      }

      // 2️⃣ Transcription
      const transcript = await this.transcribeAudio(
        upload.file.uri,
        upload.file.mimeType,
      );

      // 3️⃣ Deep analysis (LangGraph)
      const analysis = await this.runAgentWorkflow(transcript);

      // 4️⃣ Embeddings
      const embedding = await this.generateEmbedding(transcript);

      // 5️⃣ Chunking + embeddings
      const chunks = this.chunkText(transcript);
      const chunksWithEmbeddings = await Promise.all(
        chunks.map(async (chunk) => ({
          content: chunk,
          embedding: await this.generateEmbedding(chunk),
        })),
      );

      return {
        transcription: transcript,
        summary: {
          keyPoints: analysis.keyPoints || [],
          decisions: analysis.decisions || [],
          followUps: analysis.followUps || [],
          sentiment: analysis.sentiment || 'Neutral',
        },
        embedding,
        chunks: chunksWithEmbeddings,
      };
    } catch (err) {
      console.error('AI processing failed:', err);
      throw new InternalServerErrorException('Failed to process meeting audio');
    } finally {
      if (uploadedFileName) {
        await this.fileManager.deleteFile(uploadedFileName).catch(() => {});
      }
    }
  }

  /* =========================================================
     TRANSCRIPTION
  ========================================================= */

  private async transcribeAudio(
    fileUri: string,
    mimeType: string,
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const result = await model.generateContent([
      {
        fileData: { fileUri, mimeType },
      },
      {
        text: 'Transcribe this audio. Return ONLY the raw text.',
      },
    ]);

    return result.response.text().trim();
  }

  /* =========================================================
     LANGGRAPH ANALYSIS (NOW ACTUALLY USED)
  ========================================================= */

  private async runAgentWorkflow(transcript: string) {
    const cleanNode = async (state: typeof MeetingStateAnnotation.State) => {
      const result = await this.model.invoke([
        new SystemMessage(
          'Clean the transcript by fixing STT errors. Do not summarize.',
        ),
        new HumanMessage(state.transcription),
      ]);
      return { cleanedTranscript: result.content.toString() };
    };

    const analyzeNode = async (state: typeof MeetingStateAnnotation.State) => {
      const result = await this.model.invoke([
        new SystemMessage(`
You are a senior sales meeting intelligence system.

Extract:
- 6–10 key points across ALL topics
- Explicit or implied decisions
- Explicit and inferred follow-up actions
- Overall sentiment (Positive / Neutral / Negative)

Return JSON ONLY:
{
  "keyPoints": [],
  "decisions": [],
  "followUps": [],
  "sentiment": ""
}
        `),
        new HumanMessage(state.cleanedTranscript),
      ]);

      const json = this.extractJson(result.content.toString());

      return {
        keyPoints: json.keyPoints || [],
        decisions: json.decisions || [],
        followUps: json.followUps || [],
        sentiment: json.sentiment || 'Neutral',
      };
    };

    const graph = new StateGraph(MeetingStateAnnotation)
      .addNode('clean', cleanNode)
      .addNode('analyze', analyzeNode)
      .addEdge('__start__', 'clean')
      .addEdge('clean', 'analyze')
      .addEdge('analyze', END);

    return graph.compile().invoke({ transcription: transcript });
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  private extractJson(text: string): JsonResult {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      return JSON.parse(match ? match[0] : text);
    } catch {
      console.error('JSON parse failed:', text);
      return {};
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({
      model: 'text-embedding-004',
    });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      chunks.push(text.slice(start, start + chunkSize));
      start += chunkSize - overlap;
    }
    return chunks;
  }

  async answerQuestion(context: string, query: string): Promise<string> {
    const result = await this.model.invoke([
      new HumanMessage(`
Answer ONLY using this context:
${context}

Question: ${query}
If not answerable, say you don't know.
      `),
    ]);
    return result.content.toString();
  }
}
