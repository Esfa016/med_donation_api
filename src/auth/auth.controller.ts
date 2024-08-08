import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDTO } from 'src/users/Validations/userDTO';
import { SuccessMessages } from 'src/Global/messages';
import { LoginUserDTO, VerifyEmailDTO } from './Validation/authDTO';

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
  @Post('confirm-email')
  async confirmEmail(@Res() response: Response, @Body() body: VerifyEmailDTO) {
    const result = await this.authService.confirmEmail(body)
    return response.status(HttpStatus.OK).json({success:true,message:SuccessMessages.ConfirmSuccessful,userId:result._id})
  }
  
  @Post('login')
  async loginAccount(@Res() response: Response, @Body() body: LoginUserDTO) {
    const result = await this.authService.login(body)
    response.setHeader('Authorization', `Bearer ${result}`); 
    return response.status(HttpStatus.OK).json({success:true,message:SuccessMessages.LoginSuccessful,accessToken:result})
  }
}
