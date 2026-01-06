import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from './schemas/meeting.schema';
import { AiService } from '../ai/ai.service';
import * as fs from 'fs/promises';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
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
      });

      const saved = await newMeeting.save();

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
}
