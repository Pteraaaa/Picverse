import { Body, Controller, Get, Post } from '@nestjs/common';

import { registerDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }
    
    @Post('register')
    register(
        @Body() dto: registerDto,
    ) {
        return this.authService.register(dto);
    }

    @Get('register')
    test() {
        return {
            message: 'Working',
        };
    }

    @Post('login')
    login(
        @Body() dto: LoginDto
    ) {
        return this.authService.login(dto);
    }

    @Get('login')
    testLogin() {
        return {
            message: 'Working'
        }
    }
}
