import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkController } from './artwork.controller';

describe('ArtworkController', () => {
  let controller: ArtworkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtworkController],
    }).compile();

    controller = module.get<ArtworkController>(ArtworkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
