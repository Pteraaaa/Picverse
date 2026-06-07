// filepath: src/notification/artwork.notification.ts
// ...existing code...
import { Notification } from './notification.interface';

export class ArtworkNotification implements Notification {
  type = 'ARTWORK';

  buildMessage(payload: { likedByName: string; artworkTitle: string }): string {
    return `${payload.likedByName} liked your artwork "${payload.artworkTitle}"`;
  }

  send(payload: { likedByName: string; artworkTitle: string }): string {
    return this.buildMessage(payload);
  }
}