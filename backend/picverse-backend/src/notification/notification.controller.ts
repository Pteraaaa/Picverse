import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getNotifications(@CurrentUser() user: any) {
    return this.notificationService.getNotifications(user.id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationService.markAsRead(Number(id), user.id);
  }
}