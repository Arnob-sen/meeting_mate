import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
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
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, confirmPassword, name } = registerDto;

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

  async verifyOtp(email: string, otp: string) {
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
    const { email, password } = loginDto;
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
    const { email, firstName, lastName, picture } = googleUser;
    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = await this.userModel.create({
        email,
        name: `${firstName} ${lastName}`,
        avatar: picture,
        isVerified: true,
      });
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = {
      email: (user.email as string) || '',
      sub: (user._id as string) || '',
      name: (user.name as string) || '',
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user._id as string) || '',
        email: (user.email as string) || '',
        name: (user.name as string) || '',
        avatar: (user.avatar as string) || '',
      },
    };
  }
}
