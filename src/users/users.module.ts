import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './Schema/userSchema';
import { UserOTPs, UserOtpsSchema } from './Schema/userOTPSchema';
import { EmailModule } from 'src/send-grid/send-grid.module';


@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema },{name:UserOTPs.name,schema:UserOtpsSchema}]),
  ],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
