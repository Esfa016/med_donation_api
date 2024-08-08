import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Users } from './userSchema';
@Schema({ timestamps: true, expires: 30 })
export class UserOTPs extends Document{
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Users.name })
  id: mongoose.Schema.Types.ObjectId;
  @Prop({ index: true ,unique:true})
  otp: number;
  @Prop()
  token: string;
}

export const UserOtpsSchema = SchemaFactory.createForClass(UserOTPs);
