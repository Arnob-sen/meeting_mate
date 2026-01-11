import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { Meeting, MeetingSchema } from './schemas/meeting.schema';
import {
  MeetingChunk,
  MeetingChunkSchema,
} from './schemas/meeting-chunk.schema';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-message.schema';
import { AiModule } from '../ai/ai.module'; // Import the AI module

@Module({
  imports: [
    // 1. Register the specific collection/model for this module
    MongooseModule.forFeature([
      { name: Meeting.name, schema: MeetingSchema },
      { name: MeetingChunk.name, schema: MeetingChunkSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),

    // 2. Import AiModule so MeetingsService can use AiService
    AiModule,
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
