import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkController } from './artwork.controller';
import { ArtworkService } from './artwork.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('ArtworkController', () => {
  let controller: ArtworkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtworkController],
      providers: [
        {
          provide: ArtworkService,
          useValue: {
            createArtwork: jest.fn(),
            getAllArtworks: jest.fn(),
            getByTag: jest.fn(),
            getRandomTags: jest.fn(),
            toggleLike: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<ArtworkController>(ArtworkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
