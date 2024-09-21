import {IsEmail, IsNotEmpty, IsStrongPassword, MaxLength} from "class-validator";

export class SignUpDto{
    @IsNotEmpty()
    @MaxLength(50)
    username: string;

    @IsNotEmpty()
    @MaxLength(50)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MaxLength(50)
    @IsStrongPassword()
    password: string;
}