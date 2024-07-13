import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';


export class AuthenticationDto {
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}