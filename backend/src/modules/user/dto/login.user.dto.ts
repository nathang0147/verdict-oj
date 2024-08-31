import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UserLoginDto{
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example: 'admin@admin.com'})
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'admin'})
    readonly password: string;
}