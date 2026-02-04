import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paddle } from '@paddle/paddle-node-sdk';
import * as crypto from 'crypto';

@Injectable()
export class PaddleService {
  private paddle: Paddle;
  private webhookSecret: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('PADDLE_API_KEY');
    const environment = this.configService.get<string>('PADDLE_ENVIRONMENT');

    if (!apiKey) {
      throw new Error('PADDLE_API_KEY is not configured');
    }

    this.paddle = new Paddle(apiKey, {
      environment: (environment === 'production'
        ? 'production'
        : 'sandbox') as any,
    });

    const webhookSecret = this.configService.get<string>(
      'PADDLE_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      throw new Error('PADDLE_WEBHOOK_SECRET is not configured');
    }

    this.webhookSecret = webhookSecret;
  }

  /**
   * Verify webhook signature to ensure it's from Paddle
   */
  verifyWebhookSignature(
    body: string,
    signature: string,
    timestamp: string,
  ): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(`${timestamp}:${body}`)
        .digest('hex');

      const signatureHash = signature.replace('h1=', '');
      return crypto.timingSafeEqual(
        Buffer.from(signatureHash),
        Buffer.from(expectedSignature),
      );
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  /**
   * Get subscription details from Paddle
   */
  async getSubscription(subscriptionId: string) {
    try {
      return await this.paddle.subscriptions.get(subscriptionId);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string) {
    try {
      return await this.paddle.subscriptions.cancel(subscriptionId, {
        effectiveFrom: 'next_billing_period',
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string) {
    try {
      return await this.paddle.transactions.get(transactionId);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  /**
   * Get customer details
   */
  async getCustomer(customerId: string) {
    try {
      return await this.paddle.customers.get(customerId);
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }
}
