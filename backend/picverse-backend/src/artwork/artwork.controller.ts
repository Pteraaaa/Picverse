import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { LikeArtworkDto } from './dtos/like.artwork.dto';

@Controller('artwork')
export class ArtworkController {
    constructor(
        private readonly artworkService: ArtworkService
    ) { }
    
    @Get()
    getAllArtworks(@Query('userId') userId: string) {
        return this.artworkService.getAllArtworks(Number(userId));
    }

    @Get('tag/:tag')
    getByTag(@Param('tag') tag: string, @Query('userId') userId: string) {
        return this.artworkService.getByTag(tag, Number(userId));
    }

    @Get('random-tags')
    getRandomTag() {
        return this.artworkService.getRandomTags();
    }

    @Post(':id/like')
    async toggleLike(@Param('id')id:String, @Body() dto: LikeArtworkDto) {
        return this.artworkService.toggleLike(dto.userId, Number(id));
    }

}
