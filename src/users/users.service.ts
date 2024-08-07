import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './Schema/userSchema';
import { Model } from 'mongoose';
import { CreateUserDTO } from './Validations/userDTO';
import { ErrorMessages } from 'src/Global/messages';
import { UserOTPs } from './Schema/userOTPSchema';
import { generateOtp, verifyOtp } from 'otp-generator-ts';
import { EmailService } from 'src/send-grid/send-grid.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly repository: Model<Users>,
      @InjectModel(UserOTPs.name) private readonly otpRepo: Model<UserOTPs>,
    private readonly emailService:EmailService
  ) {}

  createUserOtp(tokenData: UserOTPs) {
    return this.otpRepo.create(tokenData);
  }
  findByEmail(email: string) {
    return this.repository.findOne({ email: email });
  }

  async createUser(user: CreateUserDTO) {
    const userExists: Users = await this.findByEmail(user.email);
    if (userExists) throw new ConflictException(ErrorMessages.UserExists);
    const userData: Users = await this.repository.create(user);
    const { otp, token } = this.generateOTP(6, '30m');
      await this.createUserOtp({ id: userData._id, otp: otp, token: token });
      await this.emailService.sendOtp(userData.email,userData.firstName,otp.toString())
      
    return userData;
  }
  generateOTP(digits: number, time: string) {
    return generateOtp(digits, time, process.env.OTP_SECRET);
  }
  verifyOTP(otp: number, token: string): boolean {
    return verifyOtp(otp, token, process.env.JWT_USER);
  }
}
