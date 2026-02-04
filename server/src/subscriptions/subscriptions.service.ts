import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from './schemas/subscription.schema';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async createSubscription(data: {
    userId: string;
    paddleTransactionId: string;
    paddleSubscriptionId?: string;
    planType: string;
    amount: number;
    currency: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  }) {
    const subscription = new this.subscriptionModel({
      ...data,
      userId: new Types.ObjectId(data.userId),
      status: 'active',
    });
    return subscription.save();
  }

  async findByUserId(userId: string) {
    return this.subscriptionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findByPaddleSubscriptionId(paddleSubscriptionId: string) {
    return this.subscriptionModel
      .findOne({ paddleSubscriptionId })
      .lean()
      .exec();
  }

  async updateStatus(
    subscriptionId: string,
    status: string,
    currentPeriodEnd?: Date,
  ) {
    return this.subscriptionModel
      .findByIdAndUpdate(
        subscriptionId,
        { status, ...(currentPeriodEnd && { currentPeriodEnd }) },
        { new: true },
      )
      .lean()
      .exec();
  }
}
