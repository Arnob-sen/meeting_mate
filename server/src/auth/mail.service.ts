import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOtp(email: string, otp: string) {
    try {
      const fromEmail =
        process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const { data, error } = await this.resend.emails.send({
        from: `MeetingMate <${fromEmail}>`,
        to: [email],
        subject: 'Your Verification Code',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Verify your email</h2>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>This code will expire in 10 minutes.</p>
          </div>
        `,
      });

      if (error) {
        this.logger.error(`Resend error: ${JSON.stringify(error)}`);
        // Fallback for development
        this.logger.log(`[DEV ONLY] OTP for ${email}: ${otp}`);
        return;
      }

      this.logger.log(`Email sent: ${data?.id}`);
    } catch (error) {
      this.logger.error('Failed to send email', error);
      // Fallback for development
      this.logger.log(`[DEV ONLY] OTP for ${email}: ${otp}`);
    }
  }
}
