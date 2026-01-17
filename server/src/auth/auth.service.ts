import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { MailService } from './mail.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email: rawEmail, password, confirmPassword, name } = registerDto;
    const email = rawEmail.toLowerCase().trim();

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        throw new BadRequestException('User already exists');
      }
      // If user exists but not verified, we can overwrite/update them
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (existingUser) {
      existingUser.password = hashedPassword;
      existingUser.name = name;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      await this.userModel.create({
        email,
        password: hashedPassword,
        name,
        otp,
        otpExpiry,
      });
    }

    await this.mailService.sendOtp(email, otp);
    return { message: 'OTP sent to email' };
  }

  async verifyOtp(emailRaw: string, otp: string) {
    const email = emailRaw.toLowerCase().trim();
    const user = await this.userModel.findOne({ email });
    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < new Date()
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const { email: rawEmail, password } = loginDto;
    const email = rawEmail.toLowerCase().trim();
    const user = await this.userModel.findOne({ email });

    if (!user || !user.isVerified) {
      throw new UnauthorizedException(
        'Invalid credentials or email not verified',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  async validateGoogleUser(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
  }) {
    const email = googleUser.email.toLowerCase().trim();
    const { firstName, lastName, picture } = googleUser;
    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = await this.userModel.create({
        email,
        name: `${firstName} ${lastName}`,
        avatar: picture,
        isVerified: true,
        provider: 'google',
      });
      this.logger.log(`Created new Google user in DB: ${email}`);
    } else {
      // Link as Google user if not already or just ensure verified
      let updated = false;
      if (!user.isVerified) {
        user.isVerified = true;
        updated = true;
      }
      if (user.provider !== 'google') {
        user.provider = 'google';
        updated = true;
      }
      if (updated) {
        await user.save();
        this.logger.log(`Updated existing user to Google-verified: ${email}`);
      }
    }

    return this.generateToken(user);
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };
  }

  private generateToken(user: User) {
    const payload = {
      email: user.email || '',
      sub: user._id.toString(),
      name: user.name || '',
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        email: user.email || '',
        name: user.name || '',
        avatar: user.avatar || '',
      },
    };
  }
}
