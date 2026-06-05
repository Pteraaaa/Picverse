import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { UploadFile } from './file-upload.service';

describe('SubmissionController', () => {
  let controller: SubmissionController;
  let service: SubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [
        {
          provide: SubmissionService,
          useValue: {
            createSubmission: jest.fn(),
            getSubmissionById: jest.fn(),
            getAllSubmissions: jest.fn(),
            getUserSubmissions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubmissionController>(SubmissionController);
    service = module.get<SubmissionService>(SubmissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSubmission', () => {
    it('should create a submission successfully', async () => {
      const mockFile: UploadFile = {
        fieldname: 'artwork',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        destination: 'uploads/submissions',
        filename: 'test.jpg',
        path: 'uploads/submissions/test.jpg',
        buffer: Buffer.from('test'),
      };

      const mockDto = {
        email: 'test@example.com',
        title: 'Test Artwork',
        description: 'A test artwork submission',
        tags: '#art #test',
        isAiGenerated: false,
      };

      const mockSubmission = {
        id: 1,
        ...mockDto,
        fileName: 'test.jpg',
        fileUrl: '/uploads/submissions/test.jpg',
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

      jest.spyOn(service, 'createSubmission').mockResolvedValue(mockSubmission);

      const result = await controller.createSubmission(mockDto, mockFile);

      expect(result.message).toBe('Submission created successfully');
      expect(result.data).toEqual(mockSubmission);
    });
  });
});
