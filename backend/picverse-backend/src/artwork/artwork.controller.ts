import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors, UploadedFile, HttpCode, HttpStatus } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { LikeArtworkDto } from './dtos/like.artwork.dto';
import { CreateArtworkDto } from './dtos/create-artwork.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { UploadFile } from './file-upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('artwork')
export class ArtworkController {
    constructor(
        private readonly artworkService: ArtworkService
    ) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('artwork'))
    @HttpCode(HttpStatus.CREATED)
    async createArtwork(
        @Body() dto: CreateArtworkDto,
        @UploadedFile() file: UploadFile,
        @CurrentUser() user: any,
    ) {
        return this.artworkService.createArtwork(dto, file, user.id);
    }
    
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
