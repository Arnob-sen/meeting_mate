import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { AiModule } from './ai/ai.module';
import { MeetingsModule } from './meetings/meetings.module';
import { UsersModule } from './users/users.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaddleModule } from './paddle/paddle.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL,
        maxRetriesPerRequest: null,
        tls: {},
      },
    }),
    AiModule,
    MeetingsModule,
    UsersModule,
    SubscriptionsModule,
    PaddleModule,
  ],
})
export class AppModule {}
