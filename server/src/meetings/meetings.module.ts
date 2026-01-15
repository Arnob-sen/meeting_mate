import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { Meeting, MeetingSchema } from './schemas/meeting.schema';
import {
  MeetingChunk,
  MeetingChunkSchema,
} from './schemas/meeting-chunk.schema';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-message.schema';
import { AiModule } from '../ai/ai.module';
import { MeetingProcessor } from './meeting.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meeting.name, schema: MeetingSchema },
      { name: MeetingChunk.name, schema: MeetingChunkSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
    BullModule.registerQueue({
      name: 'meetings',
    }),
    AiModule,
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingProcessor],
  exports: [MeetingsService],
})
export class MeetingsModule {}
