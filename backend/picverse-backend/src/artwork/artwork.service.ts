import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateArtworkDto } from './dtos/create-artwork.dto';
import { FileUploadService, UploadFile } from './file-upload.service';

@Injectable()
export class ArtworkService {
    constructor(
        private prisma: PrismaService,
        private fileUploadService: FileUploadService,
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

        // Parse tags from space/comma/hash separated string
        const tagNames = dto.tags
            .split(/[\s,#]+/)
            .map(t => t.trim())
            .filter(t => t.length > 0)
            .map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());

        const artwork = await this.prisma.artwork.create({
            data: {
                title: dto.title,
                description: dto.description,
                imageUrl: fileUrl,
                userId: userId,
                tags: {
                    create: tagNames.map(name => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: name },
                                create: { name: name }
                            }
                        }
                    }))
                }
            },
            include: {
                user: true,
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });

        return artwork;
    }

    async getAllArtworks(userId: number) {
        const artworks = await this.prisma.artwork.findMany({
            include: {
                user: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
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

    async getByTag(tagName: string, userId: number) {
        const artworks = await this.prisma.artwork.findMany({
            where: {
                tags: {
                    some: {
                        tag: {
                            name: tagName
                        }
                    }
                }
            },

            include: {
                user: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
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
