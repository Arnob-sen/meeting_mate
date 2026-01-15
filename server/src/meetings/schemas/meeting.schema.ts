import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MeetingDocument = HydratedDocument<Meeting>;

@Schema()
class Summary {
  @Prop([String]) keyPoints: string[];
  @Prop([String]) decisions: string[];
  @Prop([String]) followUps: string[];
  @Prop() sentiment: string;
}

@Schema({ timestamps: true })
export class Meeting {
  @Prop({ required: true })
  clientName: string;

  @Prop({
    required: true,
    enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PROCESSING',
  })
  status: string;

  @Prop()
  transcription?: string;

  @Prop({ type: Summary })
  summary?: Summary;

  @Prop([Number])
  embedding?: number[];

  // Note: We don't save the audio file path permanently in MVP to save disk space,
  // but you could add @Prop() audioUrl: string; here.
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
