import {IsEmail, IsNotEmpty, IsStrongPassword, MaxLength} from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    @MaxLength(50)
    username: string;

    @IsNotEmpty()
    @MaxLength(50)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;


}