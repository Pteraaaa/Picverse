export interface Notification {

    send(
        userId: number,
        message: string
    ): Promise<void>;

}