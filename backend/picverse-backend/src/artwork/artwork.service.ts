import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateArtworkDto } from './dtos/create-artwork.dto';
import { FileUploadService, UploadFile } from './file-upload.service';
import { TagFactory } from './tag.factory';
import { EventBusService } from 'src/common/event/event.bus.service';
import { ArtworkRepository } from './artwork.repository';
import { ArtworkRepositoryProxy } from './artwork.repository.proxy';
import { ArtworkCreationTemplate } from 'src/common/template/artwork.template';

@Injectable()
export class ArtworkService {
    constructor(
        private artworkRepositoryProxy: ArtworkRepositoryProxy,
        private artworkCreateTemplate: ArtworkCreationTemplate,
        private eventBus: EventBusService,
        private artworkRepository: ArtworkRepository
    ) {}

    async createArtwork(dto: CreateArtworkDto, file: UploadFile, userId: number) {
        return this.artworkCreateTemplate.run({ dto, file, userId });
    }

    async getAllArtworks(userId: number, sort?: string) {
        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'oldest') {
            orderBy = { createdAt: 'asc' };
        } else if (sort === 'most_likes') {
            orderBy = { likes: 'desc' };
        }

        const artworks = await this.artworkRepositoryProxy.findAll(orderBy);
        
        return artworks.map(
            artwork => ({
                ...artwork,
                liked: artwork.artworkLikes.some(
                    like => like.userId === userId
                )
            })
        )
    }

    async getByTag(tagName: string, userId: number, sort?: string) {
        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'oldest') {
            orderBy = { createdAt: 'asc' };
        } else if (sort === 'most_likes') {
            orderBy = { likes: 'desc' };
        }

        const artworks = await this.artworkRepositoryProxy.findByTag(
            tagName,
            orderBy,
        );
        return artworks.map(
            artwork => ({
                ...artwork,
                liked: artwork.artworkLikes.some(
                    like => like.userId === userId
                )
            })
        )
    }

    async getRandomTags() {
        const tags = await this.artworkRepositoryProxy.findRandomTags();

        return tags.sort(() => Math.random() - 0.5).slice(0, 5);
    }

    async getTrendingTags() {
        return this.artworkRepositoryProxy.findTrendingTags();
    }

    async getFeaturedArtworks(userId?: number) {
        const artworks = await this.artworkRepositoryProxy.findFeaturedArtworks();

        return artworks.map(artwork => ({
            ...artwork,
            liked: userId ? artwork.artworkLikes.some(like => like.userId === userId) : false
        }));
    }

    async getBannerArtworks() {
        return this.artworkRepositoryProxy.findBannerArtworks();
    }

    async getAllTags() {
        return this.artworkRepositoryProxy.findAllTags();
    }

    async toggleLike(
    userId: number,
    artworkId: number,
) {

    const existingLike =
        await this.artworkRepository.findLike(userId, artworkId);

    if (existingLike) {

        await this.artworkRepository.deleteLike(userId, artworkId);

        this.artworkRepositoryProxy.clearCache();

        const artwork =
            await this.artworkRepository.decrementLikes(artworkId);

        return {

            liked: false,

            likes: artwork.likes,
        };
    }

        await this.artworkRepository.createLike(userId, artworkId);
        
        this.artworkRepositoryProxy.clearCache();

    const artwork =
        await this.artworkRepository.incrementLikes(artworkId);

        if (artwork.userId !== userId) {
            const likedByUserName = await this.artworkRepository.findUserById(userId);

            this.eventBus.emit('artwork.liked', {
                ownerId: artwork.userId,
                likedByUserId: userId,
                likedByUserName: likedByUserName?.name,
                artworkId: artwork.id,
                artworkTitle: artwork.title
            })
        }

    return {

        liked: true,
        likes: artwork.likes,
    };
}

}
