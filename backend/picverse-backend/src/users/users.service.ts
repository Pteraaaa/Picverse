import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserRepository } from './users.repository';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private userRepository: UserRepository) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.findById(userId);

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
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Email duplication check
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);

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
    const updatedUser = await this.userRepository.update(
      userId,
      {
        name: dto.name,
        email: dto.email,
        profilePicture: profilePictureUrl ?? undefined,
      }
    );

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
    };
  }
}
