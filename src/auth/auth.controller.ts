import { Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { AuthenticationDto } from './dto/authentication.dto';
import { LoginResponse } from './interfaces/login-response.interface';

@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService) {}

    @Post('/register')
    async register(@Body() registrationDto: RegistrationDto) : Promise<LoginResponse> {
        return await this.authService.register(registrationDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async logIn(@Body() authenticationDto: AuthenticationDto) : Promise<LoginResponse> {
        return await this.authService.logIn(authenticationDto);
    }
}
