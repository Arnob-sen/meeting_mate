import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs/promises';
import { Meeting, MeetingDocument } from './schemas/meeting.schema';
import {
  MeetingChunk,
  MeetingChunkDocument,
} from './schemas/meeting-chunk.schema';
import { AiService } from '../ai/ai.service';

interface JobData {
  meetingId: string;
  filePath: string;
  mimeType: string;
}

@Processor('meetings', {
  concurrency: 1,
  stalledInterval: 300000, // Check for stalled jobs every 5 mins instead of 30s
  drainDelay: 10000, // wait 5 minutes between polls when empty
})
export class MeetingProcessor extends WorkerHost {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<MeetingDocument>,
    @InjectModel(MeetingChunk.name)
    private meetingChunkModel: Model<MeetingChunkDocument>,
    private aiService: AiService,
  ) {
    super();
    console.log(
      '[MeetingProcessor] Initialized and listening for "meetings" queue...',
    );
  }

  async process(job: Job<JobData>): Promise<any> {
    const { meetingId, filePath, mimeType } = job.data;

    try {
      console.log(
        `[MeetingProcessor] RECEIVED JOB: ${job.id} for meeting ${meetingId}`,
      );

      // 0. Verify file exists
      try {
        await fs.access(filePath);
        console.log(`[MeetingProcessor] File verified at: ${filePath}`);
      } catch {
        console.error(
          `[MeetingProcessor] CRITICAL: File not found at ${filePath}. Job cannot proceed.`,
        );
        throw new Error(`File not found: ${filePath}`);
      }

      console.log(
        `[MeetingProcessor] Starting AI analysis for meeting ${meetingId}... This may take a few minutes.`,
      );

      const aiResult = await this.aiService.processAudioFile(
        filePath,
        mimeType,
      );

      // 1. Update meeting document
      await this.meetingModel.findByIdAndUpdate(meetingId, {
        transcription: aiResult.transcription,
        summary: aiResult.summary,
        embedding: aiResult.embedding,
        status: 'COMPLETED',
      });

      // 2. Save chunks
      if (aiResult.chunks?.length) {
        await this.meetingChunkModel.insertMany(
          aiResult.chunks.map((chunk) => ({
            meetingId,
            content: chunk.content,
            embedding: chunk.embedding,
          })),
        );
      }

      // 3. Cleanup file
      await fs.unlink(filePath).catch(() => {});

      console.log(
        `[MeetingProcessor] Meeting ${meetingId} processed successfully.`,
      );
    } catch (error) {
      console.error(
        `[MeetingProcessor] Error processing meeting ${meetingId}:`,
        error,
      );

      await this.meetingModel.findByIdAndUpdate(meetingId, {
        status: 'FAILED',
      });

      // Cleanup file even on failure
      if (filePath) {
        await fs.unlink(filePath).catch(() => {});
      }

      throw error;
    }
  }
}
