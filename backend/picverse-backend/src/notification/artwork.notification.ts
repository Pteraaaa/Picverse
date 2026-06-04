import { Notification } from "./notification.interface";

export class ArtworkNotification implements Notification {

    async send(
        userId: number,
        message: string
    ) {

        console.log(
            `Artwork notification sent to ${userId}`
        );
    }
}