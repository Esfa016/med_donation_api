import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import mongoose from "mongoose";
import { AccountRoles, AllowedAccountRoles } from "src/Global/sharables";

export class CreateUserDTO  {
    @IsString()
    @IsNotEmpty()
    firstName: string
    @IsString()
    @IsNotEmpty()
    lastName: string
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string
    @IsStrongPassword()
    @IsNotEmpty()
    password: string
    @IsMongoId()
    @IsOptional()
    companyId: mongoose.Schema.Types.ObjectId
    @IsString()
    @IsNotEmpty()
    recepientOrgId: string
    @IsEnum(AllowedAccountRoles)
    @IsNotEmpty()
    role:AllowedAccountRoles
    

}
