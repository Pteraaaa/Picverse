import { Notification } from "./notification.interface";

export class ForumNotification implements Notification {

    async send(
        userId: number,
        message: string
    ) {

        console.log(
            `Forum notification sent to ${userId}`
        );
    }
}