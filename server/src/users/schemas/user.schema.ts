import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name?: string;

  @Prop({ unique: true, sparse: true })
  googleId?: string;

  @Prop({
    type: String,
    enum: ['FREE', 'PRO', 'LIFETIME'],
    default: 'FREE',
  })
  subscriptionTier: string;

  @Prop({ default: 0 })
  monthlyMinutesUsed: number;

  @Prop({ default: 0 })
  bonusMinutes: number; // From referrals

  @Prop({ default: 0 })
  lifetimeMinutes: number; // From lifetime purchase

  @Prop()
  paddleCustomerId?: string;

  @Prop()
  paddleSubscriptionId?: string;

  @Prop()
  subscriptionStatus?: string; // 'active', 'past_due', 'canceled'

  @Prop()
  currentPeriodEnd?: Date;

  @Prop({ unique: true, sparse: true })
  referralCode?: string;

  @Prop({ default: 0 })
  referralCount: number;

  @Prop()
  lastMonthlyReset?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
