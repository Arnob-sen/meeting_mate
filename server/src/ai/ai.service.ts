import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FileState, GoogleAIFileManager } from '@google/generative-ai/server';
import { ConfigService } from '@nestjs/config';

export interface MeetingSummary {
  transcription: string;
  summary: {
    keyPoints: string[];
    decisions: string[];
    followUps: string[];
    sentiment: string;
  };
}

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private fileManager: GoogleAIFileManager;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.fileManager = new GoogleAIFileManager(apiKey);
  }

  async processAudioFile(
    filePath: string,
    mimeType: string,
  ): Promise<MeetingSummary> {
    let uploadedFileName: string | null = null;

    try {
      // 1. Upload to Gemini Temp Storage
      const uploadResult = await this.fileManager.uploadFile(filePath, {
        mimeType,
        displayName: 'Meeting Audio',
      });
      uploadedFileName = uploadResult.file.name;

      // 2. Wait for processing (Polling)
      let file = await this.fileManager.getFile(uploadResult.file.name);
      while (file.state === FileState.PROCESSING) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        file = await this.fileManager.getFile(uploadResult.file.name);
      }

      if (file.state === FileState.FAILED)
        throw new Error('AI Audio processing failed');

      // 3. Generate Content
      // Use gemini-1.5-pro as it supports file inputs (audio files)
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });
      const prompt = `
        You are a CRM assistant. Listen to this audio.
        1. Transcribe the conversation nicely.
        2. Summarize key points, decisions, and follow-ups.
        3. Determine client sentiment (Positive/Neutral/Negative).
        4. Return ONLY raw JSON (no markdown formatting) in this structure:
        {
          "transcription": "...",
          "summary": { "keyPoints": [], "decisions": [], "followUps": [], "sentiment": "" }
        }
      `;

      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResult.file.mimeType,
            fileUri: uploadResult.file.uri,
          },
        },
        { text: prompt },
      ]);

      // 4. Parse Response
      const text = result.response
        .text()
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

      // Try to extract JSON if wrapped in other text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const cleanedText = jsonMatch ? jsonMatch[0] : text;

      const parsed = JSON.parse(cleanedText) as MeetingSummary;
      return parsed;
    } catch (error) {
      console.error('AI Service Error:', error);

      // Preserve original error message for better debugging
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to process audio with AI: ${errorMessage}`,
      );
    } finally {
      // 5. Cleanup Remote File (always execute, even on error)
      if (uploadedFileName) {
        try {
          await this.fileManager.deleteFile(uploadedFileName);
        } catch (cleanupError) {
          console.error(
            `Failed to cleanup remote file ${uploadedFileName}:`,
            cleanupError,
          );
          // Don't throw - cleanup errors shouldn't mask original errors
        }
      }
    }
  }
}
