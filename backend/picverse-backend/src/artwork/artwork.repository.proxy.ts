import { Injectable } from '@nestjs/common';
import { ArtworkRepository } from './artwork.repository';

@Injectable()
export class ArtworkRepositoryProxy {
  private cache = new Map<string, any>();

  constructor(
    private artworkRepository: ArtworkRepository,
  ) {}

  async findAll(orderBy: any) {
    const key = `artworks-${JSON.stringify(orderBy)}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result =
      await this.artworkRepository.findAll(orderBy);

    this.cache.set(key, result);

    return result;
  }

  async findByTag(
    tagName: string,
    orderBy: any,
  ) {
    const key =
      `tag-${tagName}-${JSON.stringify(orderBy)}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result =
      await this.artworkRepository.findByTag(
        tagName,
        orderBy,
      );

    this.cache.set(key, result);

    return result;
  }

  async findFeaturedArtworks() {
    const key = 'featured-artworks';

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result =
      await this.artworkRepository.findFeaturedArtworks();

    this.cache.set(key, result);

    return result;
  }

  async findTrendingTags() {
    const key = 'trending-tags';

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result =
      await this.artworkRepository.findTrendingTags();

    this.cache.set(key, result);

    return result;
  }

  async findRandomTags() {
    const key = 'all-tags-for-random';

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result =
      await this.artworkRepository.findRandomTags();

    this.cache.set(key, result);

    return result;
  }

  async findBannerArtworks() {
    const key = 'banner-artworks';

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result =
      await this.artworkRepository.findBannerArtworks();

    this.cache.set(key, result);

    return result;
  }

  async findAllTags() {
    const key = 'all-tags';

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result =
      await this.artworkRepository.findAllTags();

    this.cache.set(key, result);

    return result;
  }

  clearCache() {
    this.cache.clear();
  }
}