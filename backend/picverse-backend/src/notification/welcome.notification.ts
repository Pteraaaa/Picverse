import { Notification } from './notification.interface';

export class WelcomeNotification implements Notification {

    async send(
        userId: number,
        message: string
    ) {

        console.log(
            `Welcome notification sent to ${userId}`
        );
    }
}