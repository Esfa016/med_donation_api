import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './Schema/userSchema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDTO } from './Validations/userDTO';
import { ErrorMessages } from 'src/Global/messages';
import { UserOTPs } from './Schema/userOTPSchema';
import { generateOtp, verifyOtp } from 'otp-generator-ts';
import { EmailService } from 'src/send-grid/send-grid.service';
import { AccountStatus } from 'src/Global/sharables';
import { VerifyEmailDTO } from 'src/auth/Validation/authDTO';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly repository: Model<Users>,
    @InjectModel(UserOTPs.name) private readonly otpRepo: Model<UserOTPs>,
    private readonly emailService: EmailService,
  ) {}

  createUserOtp(
    id: mongoose.Schema.Types.ObjectId,
    otp: number,
    token: string,
  ) {
    return this.otpRepo.create({ id: id, otp: otp, token: token });
  }
  findByEmail(email: string) {
    return this.repository.findOne({ email: email });
  }

  async createUser(user: CreateUserDTO) {
    const userExists: Users = await this.findByEmail(user.email);
    if (userExists) throw new ConflictException(ErrorMessages.UserExists);
    const userData: Users = await this.repository.create(user);
    const { otp, token } = this.generateOTP(6, '30m');
    await this.createUserOtp(userData._id, otp, token);
    await this.emailService.sendOtp(
      userData.email,
      userData.firstName,
      otp.toString(),
    );

    return userData;
  }
  generateOTP(digits: number, time: string) {
    return generateOtp(digits, time, process.env.OTP_SECRET);
  }
  verifyOTP(otp: number, token: string): boolean {
    return verifyOtp(otp, token, process.env.JWT_USER);
  }
  deleteOtp(id: mongoose.Schema.Types.ObjectId) {
    return this.otpRepo.findByIdAndDelete(id);
  }
  findById(id: mongoose.Schema.Types.ObjectId) {
    return this.repository.findById(id).select('-password');
  }
  async confirmEmail(verifyEmail:VerifyEmailDTO) {
    const otpFound: UserOTPs = await this.otpRepo.findOne({ otp: verifyEmail.otp });
    if (!otpFound) throw new NotFoundException(ErrorMessages.OtpMismatch);
    const isValidOtp: boolean = this.verifyOTP(otpFound.otp, otpFound.token);
    if (!isValidOtp) {
      await this.deleteOtp(otpFound._id);
      throw new ForbiddenException(ErrorMessages.OtpExpire);
    }
    const user: Users = await this.repository.findByIdAndUpdate(otpFound.id, {
      accountActivated: true,
      status: AccountStatus.ENABLED,
    });
    return user;
  }

 
}
