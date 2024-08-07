import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AccountRoles, AccountStatus } from 'src/Global/sharables';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class Users extends Document {
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop({ index: true, unique: true })
  email: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  password: string;
  @Prop({ type: Boolean, default: false })
  accountActivated: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  companyId: mongoose.Schema.Types.ObjectId;
  @Prop()
  recepientOrgId: string;
  @Prop({ enum: AccountRoles })
  role: AccountRoles;
  @Prop({ enum: AccountStatus, default:AccountStatus.ENABLED })
  status:AccountStatus
}

export const UsersSchema = SchemaFactory.createForClass(Users);

UsersSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 8);
  next();
});
