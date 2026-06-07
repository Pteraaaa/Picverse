import { Injectable } from '@nestjs/common';
import { EventBusService } from 'src/common/event/event.bus.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotificationFactory } from 'src/common/factory/notification.factory';

@Injectable()
export class NotificationService {
  constructor(
    private eventBus: EventBusService,
    private prisma: PrismaService,
  ) {
    this.eventBus.on('artwork.liked', this.handleArtworkLiked.bind(this));
  }

  private async handleArtworkLiked(payload: {
    artworkId: any;
    ownerId: number;
    likedByUserId: number;
    likedByUserName: string;
    artworkTitle: string;
  }) {
    const notification = NotificationFactory.create('ARTWORK');
    const message = notification.buildMessage({
      likedByName: payload.likedByUserName,
      artworkTitle: payload.artworkTitle,
    });

    const createdNotif = await this.prisma.notification.create({
      data: {
        recipientId: payload.ownerId,
        senderId: payload.likedByUserId,
        artworkId: payload.artworkId,
        type: 'ARTWORK_LIKE',
        message,
      },
    });

      console.log(createdNotif);
    
  }

  async getNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: { id, recipientId: userId },
      data: { isRead: true },
    });
  }
}