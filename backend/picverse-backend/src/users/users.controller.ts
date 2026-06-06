import { Controller, Get, Patch, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('profile')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: any,
  ) {
    return this.usersService.updateProfile(user.id, dto, file);
  }
}
