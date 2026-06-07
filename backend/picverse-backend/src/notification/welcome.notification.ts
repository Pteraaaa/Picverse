// filepath: src/notification/welcome.notification.ts
// ...existing code...
import { Notification } from './notification.interface';

export class WelcomeNotification implements Notification {
  type = 'WELCOME';

  buildMessage(payload: { name: string }): string {
    return `Welcome ${payload.name}! Your account is ready.`;
  }

  send(payload: { name: string }): string {
    return this.buildMessage(payload);
  }
}