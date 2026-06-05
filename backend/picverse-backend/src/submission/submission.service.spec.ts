import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionService } from './submission.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { FileUploadService, UploadFile } from './file-upload.service';
import { BadRequestException } from '@nestjs/common';

describe('SubmissionService', () => {
  let service: SubmissionService;
  let prismaService: PrismaService;
  let fileUploadService: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionService,
        {
          provide: PrismaService,
          useValue: {
            submission: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
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

    service = module.get<SubmissionService>(SubmissionService);
    prismaService = module.get<PrismaService>(PrismaService);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubmission', () => {
    it('should throw error if file is missing', async () => {
      const mockDto = {
        email: 'test@example.com',
        title: 'Test Artwork',
        description: 'A test artwork submission',
        tags: '#art',
        isAiGenerated: false,
      };

      await expect(service.createSubmission(mockDto, null, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if file type is invalid', async () => {
      const mockFile: UploadFile = {
        fieldname: 'artwork',
        originalname: 'test.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 12345,
        destination: 'uploads',
        filename: 'test.txt',
        path: 'uploads/test.txt',
        buffer: Buffer.from('test'),
      };

      const mockDto = {
        email: 'test@example.com',
        title: 'Test Artwork',
        description: 'A test artwork submission',
        tags: '#art',
        isAiGenerated: false,
      };

      await expect(service.createSubmission(mockDto, mockFile, 1)).rejects.toThrow(
        'Invalid file type',
      );
    });

    it('should create submission successfully', async () => {
      const mockFile: UploadFile = {
        fieldname: 'artwork',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        destination: 'uploads',
        filename: 'test.jpg',
        path: 'uploads/test.jpg',
        buffer: Buffer.from('test'),
      };

      const mockDto = {
        email: 'test@example.com',
        title: 'Test Artwork',
        description: 'A test artwork submission',
        tags: '#art',
        isAiGenerated: false,
      };

      jest.spyOn(fileUploadService, 'uploadFile').mockResolvedValue({
        fileUrl: '/uploads/submissions/uuid-timestamp.jpg',
        fileName: 'test.jpg',
      });

      const mockSubmission = {
        id: 1,
        email: mockDto.email,
        title: mockDto.title,
        description: mockDto.description,
        fileUrl: '/uploads/submissions/uuid-timestamp.jpg',
        fileName: 'test.jpg',
        isAiGenerated: mockDto.isAiGenerated,
        tags: mockDto.tags,
        userId: 1,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
      };

      jest.spyOn(prismaService.submission, 'create').mockResolvedValue(mockSubmission);

      const result = await service.createSubmission(mockDto, mockFile, 1);

      expect(result).toEqual(mockSubmission);
      expect(fileUploadService.uploadFile).toHaveBeenCalledWith(mockFile);
    });
  });
});
