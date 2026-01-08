import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from './schemas/meeting.schema';
import {
  MeetingChunk,
  MeetingChunkDocument,
} from './schemas/meeting-chunk.schema';
import { AiService } from '../ai/ai.service';
import * as fs from 'fs/promises';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
    @InjectModel(MeetingChunk.name)
    private meetingChunkModel: Model<MeetingChunkDocument>,
    private aiService: AiService,
  ) {}

  async create(file: Express.Multer.File, clientName: string) {
    try {
      // 1. Send to AI
      const aiResult = await this.aiService.processAudioFile(
        file.path,
        file.mimetype,
      );

      // 2. Save to DB
      const newMeeting = new this.meetingModel({
        clientName,
        transcription: aiResult.transcription,
        summary: aiResult.summary,
        embedding: aiResult.embedding,
      });

      const saved = await newMeeting.save();

      // 2b. Save Chunks
      if (aiResult.chunks && aiResult.chunks.length > 0) {
        const chunkDocs = aiResult.chunks.map((chunk) => ({
          meetingId: saved._id,
          content: chunk.content,
          embedding: chunk.embedding,
        }));
        await this.meetingChunkModel.insertMany(chunkDocs);
      }

      // 3. Cleanup Local File
      await fs.unlink(file.path);

      // ✅ FIX: Convert Mongoose Document to Plain Object
      // This stops ClassSerializerInterceptor from crashing on Mongoose internals
      // Using JSON.parse(JSON.stringify()) ensures proper serialization of ObjectIds
      return JSON.parse(JSON.stringify(saved.toObject())) as Omit<
        Meeting,
        '_id'
      > & { _id: string };
    } catch (error) {
      if (file && file.path) await fs.unlink(file.path).catch(() => {});
      throw error;
    }
  }

  // Also update findAll to return plain objects
  async findAll() {
    const meetings = await this.meetingModel
      .find()
      .sort({ createdAt: -1 })
      .lean() // Use lean() for better performance and proper JSON serialization
      .exec();
    // Use JSON serialization to ensure ObjectIds are converted to strings
    return JSON.parse(JSON.stringify(meetings)) as Array<
      Omit<Meeting, '_id'> & { _id: string }
    >;
  }

  async search(query: string) {
    const queryEmbedding = await this.aiService.generateEmbedding(query);
    const meetings = await this.meetingModel
      .find()
      .select('clientName transcription summary createdAt embedding') // Get needed fields
      .lean()
      .exec();

    const results = meetings
      .map((meeting) => {
        if (!meeting.embedding || meeting.embedding.length === 0) return null;
        const similarity = this.cosineSimilarity(
          queryEmbedding,
          meeting.embedding,
        );
        return {
          ...meeting,
          similarity,
        };
      })
      .filter(
        (item): item is NonNullable<typeof item> =>
          item !== null && item.similarity > 0.3,
      ) // Filter low relevance
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5); // Start with top 5

    // Return without embedding vector to save bandwidth
    return results.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { embedding, ...rest } = item;
      return rest;
    });
  }

  async chat(query: string) {
    const queryEmbedding = await this.aiService.generateEmbedding(query);

    const chunks = await this.meetingChunkModel.find().lean().exec();

    const relevantChunks = chunks
      .map((chunk) => ({
        ...chunk,
        similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding),
      }))
      .filter((chunk) => chunk.similarity > 0.5)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    if (relevantChunks.length === 0) {
      return {
        answer:
          "I couldn't find any relevant information in your past meetings to answer that.",
        sources: [],
      };
    }

    // 🔹 Fetch meeting summaries
    const meetingIds = [
      ...new Set(relevantChunks.map((c) => c.meetingId.toString())),
    ];

    const meetings = await this.meetingModel
      .find({ _id: { $in: meetingIds } })
      .select('summary')
      .lean()
      .exec();

    const summariesContext = meetings
      .map(
        (m) => `
MEETING SUMMARY:
Key Points:
${m.summary.keyPoints.join('\n')}

Decisions:
${m.summary.decisions.join('\n')}

Follow-ups:
${m.summary.followUps.join('\n')}
`,
      )
      .join('\n\n');

    const chunksContext = relevantChunks
      .map((c) => `Transcript excerpt: ${c.content}`)
      .join('\n\n');

    const context = `
${summariesContext}

RELEVANT TRANSCRIPT EXCERPTS:
${chunksContext}
`;

    const answer = await this.aiService.answerQuestion(context, query);

    return {
      answer,
      sources: relevantChunks.map((c) => ({
        meetingId: c.meetingId,
        similarity: c.similarity,
      })),
    };
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const splitA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const splitB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (splitA * splitB);
  }
}
