import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseTemplate } from 'src/common/template/base.template';
import { CreateArtworkDto } from '../../artwork/dtos/create-artwork.dto';
import { FileUploadService, UploadFile } from '../../artwork/file-upload.service';
import { TagFactory } from '../../artwork/tag.factory';
import { ArtworkRepository } from '../../artwork/artwork.repository';
import { ArtworkRepositoryProxy } from 'src/artwork/artwork.repository.proxy';
import { EventBusService } from 'src/common/event/event.bus.service';

type Input = { dto: CreateArtworkDto; file: UploadFile; userId: number };
type Output = any; // adjust to your Artwork type

@Injectable()
export class ArtworkCreationTemplate extends BaseTemplate<Input, Output> {
  constructor(
    private fileUploadService: FileUploadService,
    private tagFactory: TagFactory,
    private artworkRepository: ArtworkRepository,
    private artworkRepostioryProxy: ArtworkRepositoryProxy,
    private eventBus: EventBusService,
  ) { super(); }

  protected async validate(input: Input) {
    if (!input.file) throw new BadRequestException('File is required');
    const valid = ['image/jpeg','image/png','image/jpg'];
    if (!valid.includes(input.file.mimetype)) throw new BadRequestException('Invalid file type');
  }

  protected async preprocess(input: Input) {
    const { file, dto } = input;
    const { fileUrl } = await this.fileUploadService.uploadFile(file);

    // parse tags (same logic you already have)
    let tagNames: string[] = [];
    if (Array.isArray(dto.tags)) tagNames = dto.tags;
    else if (typeof dto.tags === 'string') {
      tagNames = dto.tags.split(/[\s,#]+/).map(t=>t.trim()).filter(Boolean);
    }
    const processedTags = tagNames.map(name => {
      const standard = ['digitalart','portrait','anime','fantasy','cyberpunk','aiart','nature','photography','abstract','pixelart','character'];
      const isStandard = standard.includes(name.toLowerCase());
      return this.tagFactory.createTag(name, !isStandard);
    });

    return { dto, fileUrl, processedTags, userId: input.userId };
  }

  protected async executeCore(prepared: any) {
    return this.artworkRepository.createArtwork({
      data: {
        title: prepared.dto.title,
        description: prepared.dto.description,
        imageUrl: prepared.fileUrl,
        userId: prepared.userId,
        tags: {
          connectOrCreate: prepared.processedTags.map(tag => ({
            where: { name: tag.name },
            create: { name: tag.name }
          }))
        }
      },
      include: { user: true, tags: true }
    });
  }

  protected async postprocess(result: any) {
    // emit events, resize thumbnails, etc.
    this.eventBus.emit('artwork.created', { id: result.id, userId: result.userId });
    return result;
  }
}