import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { PaddleService } from './paddle.service';
import { UsersService } from '../users/users.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Controller('paddle')
export class PaddleController {
  constructor(
    private readonly paddleService: PaddleService,
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  /**
   * Paddle webhook endpoint
   * Handles all events from Paddle Billing
   */
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('paddle-signature') signature: string,
    @Body() body: any,
  ) {
    // Verify webhook signature
    const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(body);
    const timestamp = new Date().toISOString();

    const isValid = this.paddleService.verifyWebhookSignature(
      rawBody,
      signature,
      timestamp,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const eventType = body.event_type;
    const data = body.data;

    console.log(`📦 Paddle Webhook: ${eventType}`, data);

    try {
      switch (eventType) {
        case 'transaction.completed':
          await this.handleTransactionCompleted(data);
          break;

        case 'subscription.created':
          await this.handleSubscriptionCreated(data);
          break;

        case 'subscription.updated':
          await this.handleSubscriptionUpdated(data);
          break;

        case 'subscription.canceled':
          await this.handleSubscriptionCanceled(data);
          break;

        case 'subscription.past_due':
          await this.handleSubscriptionPastDue(data);
          break;

        default:
          console.log(`Unhandled event type: ${eventType}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  private async handleTransactionCompleted(data: any) {
    const customData = data.custom_data || {};
    const userEmail = customData.email || data.customer?.email;

    if (!userEmail) {
      console.error('No user email found in transaction');
      return;
    }

    // Find or create user
    let user = await this.usersService.findByEmail(userEmail);
    if (!user) {
      user = (await this.usersService.createUser(
        userEmail,
        customData.name,
      )) as any;
    }

    if (!user) {
      console.error('Failed to create or find user');
      return;
    }

    const productId = data.items[0]?.price?.product_id;
    const amount = parseFloat(data.details.totals.total) / 100;
    const currency = data.currency_code;

    // Determine plan type
    let planType = 'PRO_MONTHLY';
    let subscriptionTier = 'PRO';
    let lifetimeMinutes = 0;

    if (productId === process.env.PADDLE_PRODUCT_LIFETIME) {
      planType = 'LIFETIME';
      subscriptionTier = 'LIFETIME';
      lifetimeMinutes = 500; // 500 minutes for lifetime
    } else if (productId === process.env.PADDLE_PRODUCT_PRO_ANNUAL) {
      planType = 'PRO_ANNUAL';
    }

    // Create subscription record
    await this.subscriptionsService.createSubscription({
      userId: user._id.toString(),
      paddleTransactionId: data.id,
      paddleSubscriptionId: data.subscription_id,
      planType,
      amount,
      currency,
      currentPeriodStart: data.billed_at
        ? new Date(data.billed_at)
        : new Date(),
      currentPeriodEnd: data.subscription?.next_billed_at
        ? new Date(data.subscription.next_billed_at)
        : undefined,
    });

    // Update user subscription
    await this.usersService.updateSubscription(user._id.toString(), {
      subscriptionTier,
      paddleCustomerId: data.customer_id,
      paddleSubscriptionId: data.subscription_id,
      subscriptionStatus: 'active',
      currentPeriodEnd: data.subscription?.next_billed_at
        ? new Date(data.subscription.next_billed_at)
        : undefined,
      ...(lifetimeMinutes > 0 && { lifetimeMinutes }),
    });

    console.log(`✅ Transaction completed for ${userEmail} - ${planType}`);
  }

  private async handleSubscriptionCreated(data: any) {
    console.log('Subscription created:', data.id);
    // Usually handled by transaction.completed
  }

  private async handleSubscriptionUpdated(data: any) {
    const subscription =
      await this.subscriptionsService.findByPaddleSubscriptionId(data.id);

    if (subscription) {
      await this.subscriptionsService.updateStatus(
        subscription._id.toString(),
        data.status,
        data.next_billed_at ? new Date(data.next_billed_at) : undefined,
      );

      await this.usersService.updateSubscription(
        subscription.userId.toString(),
        {
          subscriptionStatus: data.status,
          currentPeriodEnd: data.next_billed_at
            ? new Date(data.next_billed_at)
            : undefined,
        },
      );

      console.log(`✅ Subscription updated: ${data.id} - ${data.status}`);
    }
  }

  private async handleSubscriptionCanceled(data: any) {
    const subscription =
      await this.subscriptionsService.findByPaddleSubscriptionId(data.id);

    if (subscription) {
      await this.subscriptionsService.updateStatus(
        subscription._id.toString(),
        'canceled',
      );

      // Downgrade to FREE tier
      await this.usersService.updateSubscription(
        subscription.userId.toString(),
        {
          subscriptionTier: 'FREE',
          subscriptionStatus: 'canceled',
        },
      );

      console.log(`✅ Subscription canceled: ${data.id}`);
    }
  }

  private async handleSubscriptionPastDue(data: any) {
    const subscription =
      await this.subscriptionsService.findByPaddleSubscriptionId(data.id);

    if (subscription) {
      await this.subscriptionsService.updateStatus(
        subscription._id.toString(),
        'past_due',
      );

      await this.usersService.updateSubscription(
        subscription.userId.toString(),
        {
          subscriptionStatus: 'past_due',
        },
      );

      console.log(`⚠️ Subscription past due: ${data.id}`);
    }
  }
}
