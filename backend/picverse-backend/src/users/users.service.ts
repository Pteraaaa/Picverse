import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto, file?: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Email duplication check
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
    }

    let profilePictureUrl = user.profilePicture;

    // Handle file upload if present
    if (file) {
      const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');
      
      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFileName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      // Save buffer to file
      fs.writeFileSync(filePath, file.buffer);

      profilePictureUrl = `/uploads/profiles/${uniqueFileName}`;
    }

    // Update user in database
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        email: dto.email,
        profilePicture: profilePictureUrl,
      },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
    };
  }
}
