import { IsNotEmpty, IsString, IsEmail, MinLength,Matches, Min } from "class-validator";
import { Match } from "src/common/custom-decorators-validations/match.decorator";
import { IsUnique } from "src/common/custom-decorators-validations/unique.decorator";

export class RegistrationDto {
    
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    @IsUnique({tableName: 'users', column: 'email'}) // custom decorator
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string

    @Match('password') // custom decorator
    confirm_password: string
}