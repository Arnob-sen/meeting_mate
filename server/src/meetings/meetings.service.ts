import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

const MAX_CONTEXT_CHARS = 6000;
const MAX_CHUNKS = 3;
const MAX_HISTORY_MESSAGES = 4;

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
    @InjectModel(MeetingChunk.name)
    private meetingChunkModel: Model<MeetingChunkDocument>,
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
    private aiService: AiService,
  ) {}

  /* =========================
     CREATE MEETING
  ========================= */

  async create(file: Express.Multer.File, clientName: string) {
    try {
      const aiResult = await this.aiService.processAudioFile(
        file.path,
        file.mimetype,
      );

      const meeting = await this.meetingModel.create({
        clientName,
        transcription: aiResult.transcription,
        summary: aiResult.summary,
        embedding: aiResult.embedding,
      });

      if (aiResult.chunks?.length) {
        await this.meetingChunkModel.insertMany(
          aiResult.chunks.map((c) => ({
            meetingId: meeting._id,
            content: c.content,
            embedding: c.embedding,
          })),
        );
      }

      await fs.unlink(file.path);
      return {
        ...meeting.toObject(),
        _id: meeting._id.toString(),
      };
    } catch (err) {
      if (file?.path) await fs.unlink(file.path).catch(() => {});
      throw err;
    }
  }

  /* =========================
     FIND ALL (unchanged)
  ========================= */

  async findAll(limit = 20, before?: string) {
    const filter: any = {};
    if (before) filter.createdAt = { $lt: new Date(before) };

    const meetings = await this.meetingModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    // Convert _id to string
    return meetings.map((m) => ({
      ...m,
      _id: m._id.toString(),
    }));
  }

  /* =========================
     SEARCH (unchanged)
  ========================= */

  async search(query: string) {
    const queryEmbedding = await this.aiService.generateEmbedding(query);

    const meetings = await this.meetingModel
      .find()
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

  /* =========================
     🔥 OPTIMIZED CHAT
  ========================= */

  async chat(query: string, meetingId?: string) {
    const queryEmbedding = await this.aiService.generateEmbedding(query);

    let context = '';

    /* 1️⃣ Meeting summary FIRST (cheap + powerful) */
    if (meetingId) {
      const meeting = await this.meetingModel
        .findById(meetingId)
        .select('summary')
        .lean();

      if (meeting?.summary) {
        context += `
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

    /* 2️⃣ Add transcript chunks ONLY if needed */
    if (context.length < MAX_CONTEXT_CHARS && meetingId) {
      const chunks = await this.meetingChunkModel
        .find({ meetingId })
        .select('content embedding')
        .lean();

      const relevantChunks = chunks
        .map((c) => ({
          ...c,
          similarity: this.cosineSimilarity(queryEmbedding, c.embedding),
        }))
        .filter((c) => c.similarity > 0.35)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, MAX_CHUNKS);

      if (relevantChunks.length) {
        context += `\nRELEVANT TRANSCRIPT EXCERPTS:\n`;
        context += relevantChunks
          .map((c) => c.content.slice(0, 500)) // 🔥 trim
          .join('\n\n');
      }
    }

    /* 3️⃣ Short conversation history */
    const history = await this.chatMessageModel
      .find(meetingId ? { meetingId } : {})
      .sort({ createdAt: -1 })
      .limit(MAX_HISTORY_MESSAGES)
      .lean();

    if (history.length) {
      context =
        `CONVERSATION HISTORY:\n` +
        history
          .reverse()
          .map((m) => `${m.role}: ${m.content.slice(0, 200)}`)
          .join('\n') +
        `\n\n` +
        context;
    }

    /* 4️⃣ Enforce hard limit */
    context = context.slice(0, MAX_CONTEXT_CHARS);

    const answer = await this.aiService.answerQuestion(context, query);

    await this.chatMessageModel.create([
      { role: 'user', content: query, meetingId },
      { role: 'assistant', content: answer, meetingId },
    ]);

    return { answer };
  }

  /* =========================
     CHAT HISTORY
  ========================= */

  async getChatHistory(limit = 20, before?: string, meetingId?: string) {
    const filter: any = {};
    if (meetingId) filter.meetingId = meetingId;
    if (before) filter.createdAt = { $lt: new Date(before) };

    return this.chatMessageModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  /* =========================
     UTILS
  ========================= */

  private cosineSimilarity(a: number[], b: number[]) {
    const dot = a.reduce((s, v, i) => s + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB);
  }
}
