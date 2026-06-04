import { ArtworkNotification }
from '../../notification/artwork.notification';

import { ForumNotification }
from '../../notification/forum.notification';

import { WelcomeNotification }
from '../../notification/welcome.notification';

export class NotificationFactory {

    static create(
        type: string,
    ) {

        switch (type) {

            case "WELCOME":
                return new WelcomeNotification();

            case "ARTWORK":
                return new ArtworkNotification();

            case "FORUM":
                return new ForumNotification();

            default:
                throw new Error(
                    "Unknown notification type"
                );
        }
    }
}