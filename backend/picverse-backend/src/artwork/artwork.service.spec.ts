import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkService } from './artwork.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { FileUploadService } from './file-upload.service';

describe('ArtworkService', () => {
  let service: ArtworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtworkService,
        {
          provide: PrismaService,
          useValue: {
            artwork: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: FileUploadService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArtworkService>(ArtworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
