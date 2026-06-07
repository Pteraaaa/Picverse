import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/common/prisma/prisma.service';
import { registerDto } from './dtos/register.dto';
import { UserBuilder } from 'src/common/builder/user.builder';
import { LoginDto } from './dtos/login.dto';
import { NotificationFactory } from 'src/common/factory/notification.factory';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }
    
    async register(
        dto: registerDto
    ) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (existingUser) {
            throw new BadRequestException(
                'Email already exists'
            );
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = new UserBuilder().setName(dto.name).setEmail(dto.email).setPassword(hashedPassword).build();

        const createdUser = await this.prisma.user.create({
            data: user
        });

        return {
            message: 'User registered successfully',
            userId: createdUser.id
        };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            },
        });

        if (!user) {
            throw new BadRequestException(
                'Invalid email or password'
            );
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password);

        if (!passwordMatch) {
            throw new BadRequestException(
                'Incorrect email or password'
            );
        }

        const payload = {
            sub: user.id,
            email: user.email
        };

        const token = await this.jwtService.signAsync(payload);
        return {
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }
}
