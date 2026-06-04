-- CreateTable
CREATE TABLE `ArtworkLikes` (
    `userId` INTEGER NOT NULL,
    `artworkId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `artworkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ArtworkLikes` ADD CONSTRAINT `ArtworkLikes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArtworkLikes` ADD CONSTRAINT `ArtworkLikes_artworkId_fkey` FOREIGN KEY (`artworkId`) REFERENCES `Artwork`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
