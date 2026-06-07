import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors, UploadedFile, HttpCode, HttpStatus } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { LikeArtworkDto } from './dtos/like.artwork.dto';
import { CreateArtworkDto } from './dtos/create-artwork.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { UploadFile } from './file-upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ArtworkFacade } from './artwork.facade';

@Controller('artwork')
export class ArtworkController {
    constructor(
        private readonly artworkFacade: ArtworkFacade,
        private readonly artworkService: ArtworkService
    ) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('artwork'))
    @HttpCode(HttpStatus.CREATED)
    async createArtwork(
        @Body() dto: CreateArtworkDto,
        @UploadedFile() file: UploadFile,
        @Body('userId') bodyUserId: string,
    ) {
        const parsedUserId = parseInt(bodyUserId, 10);
        return this.artworkFacade.createArtwork(dto, file, parsedUserId);
    }
    
    @Get()
    getAllArtworks(@Query('userId') userId: string, @Query('sort') sort?: string) {
        return this.artworkFacade.getAllArtworks(Number(userId), sort);
    }

    @Get('tag/:tag')
    getByTag(@Param('tag') tag: string, @Query('userId') userId: string, @Query('sort') sort?: string) {
        return this.artworkFacade.getByTag(tag, Number(userId), sort);
    }

    @Get('banner')
    getBannerArtworks() {
        return this.artworkService.getBannerArtworks();
    }

    @Get('featured')
    getFeaturedArtworks(@Query('userId') userId?: string) {
        return this.artworkService.getFeaturedArtworks(userId ? Number(userId) : undefined);
    }

    @Get('tags/trending')
    getTrendingTags() {
        return this.artworkService.getTrendingTags();
    }

    @Get('random-tags')
    getRandomTag() {
        return this.artworkFacade.getRandomTags();
    }

    @Get('tags')
    getAllTags() {
        return this.artworkFacade.getAllTags();
    }

    @Post(':id/like')
    async toggleLike(@Param('id')id:String, @Body() dto: LikeArtworkDto) {
        return this.artworkFacade.toggleLike(dto.userId, Number(id));
    }

}
