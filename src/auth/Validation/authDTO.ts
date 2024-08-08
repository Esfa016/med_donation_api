import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class VerifyEmailDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(6)
    otp:string
}

export class LoginUserDTO{
    @IsEmail()
    @IsNotEmpty()
    email:string
    @IsString()
    @IsNotEmpty()
    password:string
}