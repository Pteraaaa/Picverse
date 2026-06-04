import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ArtworkService {
    constructor(
        private prisma: PrismaService
    ) {}

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
