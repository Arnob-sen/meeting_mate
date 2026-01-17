import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop()
  password?: string;

  @Prop()
  name: string;

  @Prop()
  googleId?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 'manual' })
  provider: string; // 'manual' or 'google'

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
