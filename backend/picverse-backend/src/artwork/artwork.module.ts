import { Module } from '@nestjs/common';
import { ArtworkController } from './artwork.controller';
import { ArtworkService } from './artwork.service';
import { AuthModule } from '../auth/auth.module';
import { FileUploadService } from './file-upload.service';
import { TagFactory } from './tag.factory';
import { ArtworkFacade } from './artwork.facade';
import { ArtworkRepository } from './artwork.repository';
import { ArtworkCreationTemplate } from 'src/common/template/artwork.template';
import { ArtworkRepositoryProxy } from './artwork.repository.proxy';

@Module({
  imports: [AuthModule],
  controllers: [ArtworkController],
  providers: [ArtworkService, FileUploadService, TagFactory, ArtworkFacade, ArtworkRepository, ArtworkCreationTemplate, ArtworkRepositoryProxy]
})
export class ArtworkModule {}
