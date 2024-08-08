import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from 'src/users/Validations/userDTO';
import { LoginUserDTO, VerifyEmailDTO } from './Validation/authDTO';
import { Users } from 'src/users/Schema/userSchema';
import { ErrorMessages } from 'src/Global/messages';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Account } from 'aws-sdk';
import { AccountStatus } from 'src/Global/sharables';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: CreateUserDTO) {
    return this.userService.createUser(user);
  }

  async confirmEmail(body: VerifyEmailDTO) {
    return this.userService.confirmEmail(body);
  }

  async login(loginDTO: LoginUserDTO) {
    const userFound: Users = await this.userService.findByEmail(loginDTO.email);
    if (!userFound)
      throw new UnauthorizedException(ErrorMessages.IncorrectCredentials);
    if (!userFound.accountActivated) {
      throw new ForbiddenException(ErrorMessages.VerificationRequired);
      }
      if (userFound.status === AccountStatus.DISABLED) {
          throw new ForbiddenException(ErrorMessages.AccountDisabled)
      }
    const passMatch: boolean = await bcrypt.compare(
      loginDTO.password,
      userFound.password,
    );
    if (!passMatch)
      throw new UnauthorizedException(ErrorMessages.IncorrectCredentials);
    const accessToken: string = this.jwtService.sign({
      id: userFound._id,
      email: userFound.email,
      role: userFound.role,
      fullName: userFound.firstName,
    });
      return accessToken;
  }
}
