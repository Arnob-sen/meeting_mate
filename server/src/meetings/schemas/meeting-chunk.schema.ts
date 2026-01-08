import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type MeetingChunkDocument = HydratedDocument<MeetingChunk>;

@Schema({ timestamps: true })
export class MeetingChunk {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Meeting', required: true })
  meetingId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [Number], required: true, index: true }) // Index for vector search (if using Atlas)
  embedding: number[];

  @Prop({ type: Object })
  metadata: {
    startTime?: number;
    endTime?: number;
  };
}

export const MeetingChunkSchema = SchemaFactory.createForClass(MeetingChunk);
