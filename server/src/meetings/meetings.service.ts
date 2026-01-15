import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Model, Types } from 'mongoose';
import * as fs from 'fs/promises';

import { Meeting, MeetingDocument } from './schemas/meeting.schema';
import {
  MeetingChunk,
  MeetingChunkDocument,
} from './schemas/meeting-chunk.schema';
import {
  ChatMessage,
  ChatMessageDocument,
} from './schemas/chat-message.schema';
import { AiService } from '../ai/ai.service';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
    @InjectModel(MeetingChunk.name)
    private meetingChunkModel: Model<MeetingChunkDocument>,
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
    private aiService: AiService,
    @InjectQueue('meetings') private meetingQueue: Queue,
  ) {}

  async create(file: Express.Multer.File, clientName: string) {
    try {
      // 1. Create initial meeting record
      const newMeeting = new this.meetingModel({
        clientName,
        status: 'PROCESSING',
      });

      const saved = await newMeeting.save();

      // 2. Enqueue background job
      await this.meetingQueue.add(
        'process-meeting',
        {
          meetingId: saved._id.toString(),
          filePath: file.path,
          mimeType: file.mimetype,
        },
        {
          removeOnComplete: true,
          removeOnFail: 50, // keep last 50 failures
        },
      );

      return JSON.parse(JSON.stringify(saved.toObject()));
    } catch (error) {
      if (file?.path) await fs.unlink(file.path).catch(() => {});
      throw error;
    }
  }

  async findAll(limit = 20, before?: string) {
    const filter: any = {};
    if (before) filter.createdAt = { $lt: new Date(before) };

    const meetings = await this.meetingModel
      .find(filter)
      .select('clientName summary transcription status createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return JSON.parse(JSON.stringify(meetings));
  }

  async search(query: string) {
    const queryEmbedding = await this.aiService.generateEmbedding(query);

    const meetings = await this.meetingModel
      .find({ status: 'COMPLETED' })
      .select('clientName summary embedding createdAt')
      .lean()
      .exec();

    return meetings
      .map((m) => ({
        ...m,
        similarity: m.embedding
          ? this.cosineSimilarity(queryEmbedding, m.embedding)
          : 0,
      }))
      .filter((m) => m.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .map(({ embedding, ...rest }) => rest);
  }

  // ===========================
  // 🔥 FIXED CHAT METHOD
  // ===========================
  async chat(query: string, meetingId?: string) {
    const queryEmbedding = await this.aiService.generateEmbedding(query);

    // 1️⃣ ALWAYS load meeting summary if meetingId exists
    let meetingSummaryContext = '';

    if (meetingId) {
      const meeting = await this.meetingModel
        .findById(new Types.ObjectId(meetingId))
        .select('summary')
        .lean()
        .exec();

      if (meeting?.summary) {
        meetingSummaryContext = `
MEETING SUMMARY:
Key Points:
${meeting.summary.keyPoints.join('\n')}

Decisions:
${meeting.summary.decisions.join('\n')}

Follow-ups:
${meeting.summary.followUps.join('\n')}
`;
      }
    }

    // 2️⃣ Retrieve relevant chunks (optional)
    const chunkFilter: any = {};
    if (meetingId) chunkFilter.meetingId = new Types.ObjectId(meetingId);

    const chunks = await this.meetingChunkModel.find(chunkFilter).lean().exec();

    const relevantChunks = chunks
      .map((c) => ({
        ...c,
        similarity: this.cosineSimilarity(queryEmbedding, c.embedding),
      }))
      .filter((c) => c.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    // 3️⃣ Conversation history (last 6)
    const historyFilter: any = {};
    if (meetingId) historyFilter.meetingId = new Types.ObjectId(meetingId);

    const lastMessages = await this.chatMessageModel
      .find(historyFilter)
      .sort({ createdAt: -1 })
      .limit(6)
      .lean()
      .exec();

    const conversationContext = lastMessages
      .reverse()
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    // 4️⃣ Build FINAL context (CORRECT LOGIC)
    let context = '';

    if (meetingSummaryContext) {
      context += meetingSummaryContext;
    }

    if (relevantChunks.length > 0) {
      const chunksContext = relevantChunks
        .map((c) => `Transcript excerpt: ${c.content}`)
        .join('\n\n');

      context += `
RELEVANT TRANSCRIPT EXCERPTS:
${chunksContext}
`;
    }

    const fullPrompt = `
${conversationContext ? `CONVERSATION HISTORY:\n${conversationContext}\n` : ''}
${context ? `CONTEXT FROM MEETING:\n${context}` : ''}
`;

    const answer = await this.aiService.answerQuestion(fullPrompt, query);

    // 5️⃣ Save chat history
    const sources = relevantChunks.map((c) => ({
      meetingId: c.meetingId,
      similarity: c.similarity,
    }));

    await this.chatMessageModel.create([
      {
        role: 'user',
        content: query,
        meetingId: meetingId ? new Types.ObjectId(meetingId) : undefined,
      },
      {
        role: 'assistant',
        content: answer,
        meetingId: meetingId ? new Types.ObjectId(meetingId) : undefined,
        sources,
      },
    ]);

    return { answer, sources };
  }

  async getChatHistory(limit = 20, before?: string, meetingId?: string) {
    const filter: any = {};
    if (meetingId) filter.meetingId = new Types.ObjectId(meetingId);
    if (before) filter.createdAt = { $lt: new Date(before) };

    return this.chatMessageModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  private cosineSimilarity(vecA: number[], vecB: number[]) {
    const dot = vecA.reduce((sum, v, i) => sum + v * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(vecB.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB);
  }
}
