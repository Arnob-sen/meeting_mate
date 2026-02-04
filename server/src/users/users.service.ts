import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(email: string, name?: string, googleId?: string) {
    const referralCode = this.generateReferralCode();
    const user = new this.userModel({
      email,
      name,
      googleId,
      referralCode,
      subscriptionTier: 'FREE',
      monthlyMinutesUsed: 0,
      bonusMinutes: 0,
      lifetimeMinutes: 0,
      lastMonthlyReset: new Date(),
    });
    return user.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).lean().exec();
  }

  async findByGoogleId(googleId: string) {
    return this.userModel.findOne({ googleId }).lean().exec();
  }

  async findByReferralCode(code: string) {
    return this.userModel.findOne({ referralCode: code }).lean().exec();
  }

  async updateSubscription(
    userId: string,
    data: {
      subscriptionTier?: string;
      paddleCustomerId?: string;
      paddleSubscriptionId?: string;
      subscriptionStatus?: string;
      currentPeriodEnd?: Date;
      lifetimeMinutes?: number;
    },
  ) {
    return this.userModel
      .findByIdAndUpdate(userId, data, { new: true })
      .lean()
      .exec();
  }

  async deductMinutes(userId: string, minutes: number) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    user.monthlyMinutesUsed += minutes;
    return user.save();
  }

  async addBonusMinutes(userId: string, minutes: number) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    user.bonusMinutes += minutes;
    user.referralCount += 1;
    return user.save();
  }

  async getAvailableMinutes(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    const tierLimits = {
      FREE: 300,
      PRO: 2000,
      LIFETIME: Infinity,
    };

    const monthlyLimit = tierLimits[user.subscriptionTier] || 0;
    const monthlyRemaining = Math.max(
      0,
      monthlyLimit - user.monthlyMinutesUsed,
    );

    // Lifetime + Bonus can be used even if monthly is exhausted
    return monthlyRemaining + user.bonusMinutes + user.lifetimeMinutes;
  }

  async resetMonthlyUsage(userId: string) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { monthlyMinutesUsed: 0, lastMonthlyReset: new Date() },
        { new: true },
      )
      .lean()
      .exec();
  }

  private generateReferralCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }
}
