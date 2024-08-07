import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDTO } from 'src/users/Validations/userDTO';
import { SuccessMessages } from 'src/Global/messages';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('sign-up')
  async signUpDonor(@Res() response: Response, @Body() user: CreateUserDTO) {
    const result = await this.authService.createUser(user);
    return response
      .status(HttpStatus.CREATED)
      .json({
        success: true,
        message: SuccessMessages.OtpSent,
        userId: result._id,
      });
  }
}
