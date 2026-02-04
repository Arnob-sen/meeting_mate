import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  paddleTransactionId: string;

  @Prop()
  paddleSubscriptionId?: string;

  @Prop({
    required: true,
    enum: ['PRO_MONTHLY', 'PRO_ANNUAL', 'LIFETIME'],
  })
  planType: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  currency: string;

  @Prop({
    type: String,
    enum: ['active', 'canceled', 'past_due', 'completed'],
    default: 'active',
  })
  status: string;

  @Prop()
  currentPeriodStart?: Date;

  @Prop()
  currentPeriodEnd?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
