import { Injectable } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { NotificationService } from '../notification/notification.service';
import { CreateArtworkDto } from './dtos/create-artwork.dto';
import type { UploadFile } from './file-upload.service';

@Injectable()
export class ArtworkFacade {
  constructor(
    private readonly artworkService: ArtworkService,
  ) {}

  async createArtwork(dto: CreateArtworkDto, file: UploadFile, user: any) {
    const artwork = await this.artworkService.createArtwork(dto, file, user.id);


    return artwork;
  }

  async getAllArtworks(userId: number, sort?: string) {
    return this.artworkService.getAllArtworks(userId, sort);
  }

  async getByTag(tag: string, userId: number, sort?: string) {
    return this.artworkService.getByTag(tag, userId, sort);
  }

  async getRandomTags() {
    return this.artworkService.getRandomTags();
  }

  async getAllTags() {
    return this.artworkService.getAllTags();
  }

  async toggleLike(userId: number, artworkId: number) {
    return this.artworkService.toggleLike(userId, artworkId);
  }
}