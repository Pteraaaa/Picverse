// ...existing code...
import { Notification } from 'src/notification/notification.interface';
import { WelcomeNotification } from 'src/notification/welcome.notification';
import { ArtworkNotification } from 'src/notification/artwork.notification';

export class NotificationFactory {
  static create(type: 'WELCOME'): WelcomeNotification;
  static create(type: 'ARTWORK'): ArtworkNotification;
  static create(type: string): Notification {
    switch (type) {
      case 'WELCOME':
        return new WelcomeNotification();
      case 'ARTWORK':
        return new ArtworkNotification();
      default:
        throw new Error('Unknown notification type');
    }
  }
}