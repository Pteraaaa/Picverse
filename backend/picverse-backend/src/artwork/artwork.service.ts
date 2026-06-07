import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateArtworkDto } from './dtos/create-artwork.dto';
import { FileUploadService, UploadFile } from './file-upload.service';
import { TagFactory } from './tag.factory';
import { EventBusService } from 'src/common/event/event.bus.service';
import { ArtworkRepository } from './artwork.repository';
import { ArtworkCreationTemplate } from 'src/common/template/artwork.template';

@Injectable()
export class ArtworkService {
    constructor(
        private fileUploadService: FileUploadService,
        private tagFactory: TagFactory,
        private artworkCreateTemplate: ArtworkCreationTemplate,
        private eventBus: EventBusService,
        private artworkRepository: ArtworkRepository
    ) {}

    async createArtwork(dto: CreateArtworkDto, file: UploadFile, userId: number) {
        // if (!file) {
        //     throw new BadRequestException('File is required');
        // }

        // const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        // if (!validMimeTypes.includes(file.mimetype)) {
        //     throw new BadRequestException('Invalid file type. Only JPEG and PNG are allowed');
        // }

        // const { fileUrl } = await this.fileUploadService.uploadFile(file);

        // // Parse tags from input (which can be array, or space/comma/hash separated string)
        // let tagNames: string[] = [];
        // if (Array.isArray(dto.tags)) {
        //     tagNames = dto.tags;
        // } else if (typeof dto.tags === 'string') {
        //     tagNames = dto.tags
        //         .split(/[\s,#]+/)
        //         .map(t => t.trim())
        //         .filter(t => t.length > 0);
        // }

        // // Clean standard/custom tags via Factory
        // const processedTags = tagNames.map(name => {
        //     const standardTagsList = ['digitalart', 'portrait', 'anime', 'fantasy', 'cyberpunk', 'aiart', 'nature', 'photography', 'abstract', 'pixelart', 'character'];
        //     const isStandard = standardTagsList.includes(name.toLowerCase());
        //     return this.tagFactory.createTag(name, !isStandard);
        // });

        // // AI Art auto-tagging logic
        // const isAi = dto.isAiGenerated === true || dto.isAiGenerated === 'true' || dto.isAiGenerated === 'yes';
        // if (isAi) {
        //     const hasAiTag = processedTags.some(t => t.name.toLowerCase() === 'aiart');
        //     if (!hasAiTag) {
        //         processedTags.push(this.tagFactory.createTag('AIart', false));
        //     }
        // }

        // const artwork = await this.artworkRepository.createArtwork({
        //     data: {
        //         title: dto.title,
        //         description: dto.description,
        //         imageUrl: fileUrl,
        //         userId: userId,
        //         tags: {
        //             connectOrCreate: processedTags.map(tag => ({
        //                 where: { name: tag.name },
        //                 create: { name: tag.name }
        //             }))
        //         }
        //     },
        //     include: {
        //         user: true,
        //         tags: true
        //     }
        // });

        // return artwork;

        return this.artworkCreateTemplate.run({ dto, file, userId });
    }

    async getAllArtworks(userId: number, sort?: string) {
        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'oldest') {
            orderBy = { createdAt: 'asc' };
        } else if (sort === 'most_likes') {
            orderBy = { likes: 'desc' };
        }

        const artworks = await this.artworkRepository.findAll(orderBy);
        
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

        const artworks = await this.artworkRepository.findByTag(
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
        const tags = await this.artworkRepository.findRandomTags();

        return tags.sort(() => Math.random() - 0.5).slice(0, 5);
    }

    async getTrendingTags() {
        return this.artworkRepository.findTrendingTags();
    }

    async getFeaturedArtworks(userId?: number) {
        const artworks = await this.artworkRepository.findFeaturedArtworks();

        return artworks.map(artwork => ({
            ...artwork,
            liked: userId ? artwork.artworkLikes.some(like => like.userId === userId) : false
        }));
    }

    async getBannerArtworks() {
        return this.artworkRepository.findBannerArtworks();
    }

    async getAllTags() {
        return this.artworkRepository.findAllTags();
    }

    async toggleLike(
    userId: number,
    artworkId: number,
) {

    const existingLike =
        await this.artworkRepository.findLike(userId, artworkId);

    if (existingLike) {

        await this.artworkRepository.deleteLike(userId, artworkId);

        const artwork =
            await this.artworkRepository.decrementLikes(artworkId);

        return {

            liked: false,

            likes: artwork.likes,
        };
    }

    await this.artworkRepository.createLike(userId, artworkId);

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
