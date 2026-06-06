import { Module } from '@nestjs/common';
import { ArtworkController } from './artwork.controller';
import { ArtworkService } from './artwork.service';
import { AuthModule } from '../auth/auth.module';
import { FileUploadService } from './file-upload.service';
import { TagFactory } from './tag.factory';

@Module({
  imports: [AuthModule],
  controllers: [ArtworkController],
  providers: [ArtworkService, FileUploadService, TagFactory]
})
export class ArtworkModule {}
