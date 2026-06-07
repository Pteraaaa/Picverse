import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ArtworkRepository {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createArtwork(data: any) {
    return this.prisma.artwork.create(data);
  }

  async findAll(orderBy: any) {
    return this.prisma.artwork.findMany({
      orderBy,
      include: {
        user: true,
        tags: true,
        artworkLikes: true,
      },
    });
  }

  async findByTag(
    tagName: string,
    orderBy: any,
  ) {
    return this.prisma.artwork.findMany({
      where: {
        tags: {
          some: {
            name: tagName,
          },
        },
      },
      orderBy,
      include: {
        user: true,
        tags: true,
        artworkLikes: true,
      },
    });
  }

  async findRandomTags() {
    return this.prisma.tag.findMany();
  }

  async findTrendingTags() {
    return this.prisma.tag.findMany({
      orderBy: {
        artworks: {
          _count: 'desc',
        },
      },
      take: 6,
    });
  }

  async findFeaturedArtworks() {
    return this.prisma.artwork.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        user: true,
        tags: true,
        artworkLikes: true,
      },
    });
  }

  async findBannerArtworks() {
    return this.prisma.artwork.findMany({
      where: {
        isBanner: true,
      },
      include: {
        user: true,
      },
    });
  }

  async findAllTags() {
    return this.prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findLike(
    userId: number,
    artworkId: number,
  ) {
    return this.prisma.artworkLikes.findUnique({
      where: {
        userId_artworkId: {
          userId,
          artworkId,
        },
      },
    });
  }

  async createLike(
    userId: number,
    artworkId: number,
  ) {
    return this.prisma.artworkLikes.create({
      data: {
        userId,
        artworkId,
      },
    });
  }

  async deleteLike(
    userId: number,
    artworkId: number,
  ) {
    return this.prisma.artworkLikes.delete({
      where: {
        userId_artworkId: {
          userId,
          artworkId,
        },
      },
    });
  }

  async incrementLikes(
    artworkId: number,
  ) {
    return this.prisma.artwork.update({
      where: {
        id: artworkId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async decrementLikes(
    artworkId: number,
  ) {
    return this.prisma.artwork.update({
      where: {
        id: artworkId,
      },
      data: {
        likes: {
          decrement: 1,
        },
      },
    });
  }

  async findUserById(userId: number) {
  return this.prisma.user.findUnique({
    where: { id: userId },
  });
}
}