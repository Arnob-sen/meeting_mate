import { Module } from '@nestjs/common';
import { PaddleService } from './paddle.service';
import { PaddleController } from './paddle.controller';
import { UsersModule } from '../users/users.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [UsersModule, SubscriptionsModule],
  controllers: [PaddleController],
  providers: [PaddleService],
  exports: [PaddleService],
})
export class PaddleModule {}
