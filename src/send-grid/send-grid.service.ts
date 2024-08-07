import { Injectable } from '@nestjs/common';
import { TemplateIds } from './types';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';


@Injectable()
export class EmailService {
  constructor(@InjectSendGrid() private mailer: SendGridService) {}
  sendOtp(email: string, name: string, otpCode: string) {
    const messageData: Object = {
      to: email,
      from: {
        name: 'Hillsteh',
        email: 'contact@hillstech.de',
      },
      templateId: TemplateIds.OTP_VERIFY,
      dynamic_template_data: {
        user: name,
        otp: otpCode,
      },
    };
    return this.mailer.send(messageData);
  }
}
