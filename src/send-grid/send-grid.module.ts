import { Global, Module } from '@nestjs/common';
import { EmailService } from './send-grid.service';
import {SendGridModule} from '@ntegral/nestjs-sendgrid'
import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    SendGridModule.forRoot({ apiKey: process.env.SENDGRID_API_KEY })],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
