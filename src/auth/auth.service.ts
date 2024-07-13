import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import {RegistrationDto, AuthenticationDto, UserResponseDto} from './dto/index';

import { hashPassword, comparePassword } from '../common/bcrypt';

import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './interfaces/login-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService : JwtService
    ) {}

    async register( registrationDto: RegistrationDto): Promise<LoginResponse> {
        const {name, email, password} = registrationDto;
        const hashedPassword = await hashPassword(password);
        const user = this.userRepository.create({ name, email, password: hashedPassword });
        await this.userRepository.save(user);

        const payload: JwtPayload = { email };
        const accessToken = this.jwtService.sign(payload);
        
        const userDto: UserResponseDto = {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive
        };
        
        return {
            accessToken: accessToken,
            user: userDto
        }
    }

    async logIn(authenticationDto:  AuthenticationDto) : Promise<LoginResponse> {
        const {email, password} = authenticationDto;

        const user = await this.userRepository.findOneBy({ email});
        if(user && (await comparePassword(password, user.password))) {
            const payload: JwtPayload = { email };
            const accessToken = this.jwtService.sign(payload);
            
            const userDto: UserResponseDto = {
                id: user.id,
                name: user.name,
                email: user.email,
                isActive: user.isActive
            };

            return {
                accessToken: accessToken,
                user: userDto
            }
        }else{
            throw new UnauthorizedException('Invalid credentials');
        }

    }   
}
