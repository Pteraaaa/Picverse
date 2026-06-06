import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateArtworkDto } from './dtos/create-artwork.dto';
import { FileUploadService, UploadFile } from './file-upload.service';
import { TagFactory } from './tag.factory';

@Injectable()
export class ArtworkService {
    constructor(
        private prisma: PrismaService,
        private fileUploadService: FileUploadService,
        private tagFactory: TagFactory,
    ) {}

    async createArtwork(dto: CreateArtworkDto, file: UploadFile, userId: number) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Only JPEG and PNG are allowed');
        }

        const { fileUrl } = await this.fileUploadService.uploadFile(file);

        // Parse tags from input (which can be array, or space/comma/hash separated string)
        let tagNames: string[] = [];
        if (Array.isArray(dto.tags)) {
            tagNames = dto.tags;
        } else if (typeof dto.tags === 'string') {
            tagNames = dto.tags
                .split(/[\s,#]+/)
                .map(t => t.trim())
                .filter(t => t.length > 0);
        }

        // Clean standard/custom tags via Factory
        const processedTags = tagNames.map(name => {
            const standardTagsList = ['digitalart', 'portrait', 'anime', 'fantasy', 'cyberpunk', 'aiart', 'nature', 'photography', 'abstract', 'pixelart', 'character'];
            const isStandard = standardTagsList.includes(name.toLowerCase());
            return this.tagFactory.createTag(name, !isStandard);
        });

        // AI Art auto-tagging logic
        const isAi = dto.isAiGenerated === true || dto.isAiGenerated === 'true' || dto.isAiGenerated === 'yes';
        if (isAi) {
            const hasAiTag = processedTags.some(t => t.name.toLowerCase() === 'aiart');
            if (!hasAiTag) {
                processedTags.push(this.tagFactory.createTag('AIart', false));
            }
        }

        const artwork = await this.prisma.artwork.create({
            data: {
                title: dto.title,
                description: dto.description,
                imageUrl: fileUrl,
                userId: userId,
                tags: {
                    connectOrCreate: processedTags.map(tag => ({
                        where: { name: tag.name },
                        create: { name: tag.name }
                    }))
                }
            },
            include: {
                user: true,
                tags: true
            }
        });

        return artwork;
    }

    async getAllArtworks(userId: number, sort?: string) {
        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'oldest') {
            orderBy = { createdAt: 'asc' };
        } else if (sort === 'most_likes') {
            orderBy = { likes: 'desc' };
        }

        const artworks = await this.prisma.artwork.findMany({
            orderBy,
            include: {
                user: true,
                tags: true,
                artworkLikes: true,
            }
        });
        
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

        const artworks = await this.prisma.artwork.findMany({
            where: {
                tags: {
                    some: {
                        name: tagName
                    }
                }
            },
            orderBy,
            include: {
                user: true,
                tags: true,
                artworkLikes: true,
            }
        });
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
        const tags = await this.prisma.tag.findMany();

        return tags.sort(() => Math.random() - 0.5).slice(0, 5);
    }

    async getAllTags() {
        return this.prisma.tag.findMany({
            orderBy: {
                name: 'asc'
            }
        });
    }

    async toggleLike(
    userId: number,
    artworkId: number,
) {

    const existingLike =
        await this.prisma.artworkLikes.findUnique({

            where: {

                userId_artworkId: {

                    userId,
                    artworkId,
                },
            },
        });

    if (existingLike) {

        await this.prisma.artworkLikes.delete({

            where: {

                userId_artworkId: {

                    userId,
                    artworkId,
                },
            },
        });

        const artwork =
            await this.prisma.artwork.update({

                where: {
                    id: artworkId,
                },

                data: {

                    likes: {
                        decrement: 1,
                    },
                },
            });

        return {

            liked: false,

            likes: artwork.likes,
        };
    }

    await this.prisma.artworkLikes.create({

        data: {

            userId,
            artworkId,
        },
    });

    const artwork =
        await this.prisma.artwork.update({

            where: {
                id: artworkId,
            },

            data: {

                likes: {
                    increment: 1,
                },
            },
        });

    return {

        liked: true,
        likes: artwork.likes,
    };
}

}
