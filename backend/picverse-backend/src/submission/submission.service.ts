import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateSubmissionDto } from './dtos/create.submission.dto';
import { SubmissionBuilder } from './submission.builder';
import { FileUploadService, UploadFile } from './file-upload.service';

@Injectable()
export class SubmissionService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  async createSubmission(
    dto: CreateSubmissionDto,
    file: UploadFile,
    userId?: number,
  ) {
    // Validate file
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG and PNG are allowed');
    }

    if (file.size > 1073741824) {
      throw new BadRequestException('File size must be 1 GB or less');
    }

    // Upload file using Strategy pattern
    const { fileUrl, fileName } = await this.fileUploadService.uploadFile(file);

    // Parse aiGenerated - handle both string and boolean from FormData
    const isAiGenerated = dto.isAiGenerated === 'true' || dto.isAiGenerated === true;

    // Build submission using Builder pattern
    const submissionData = new SubmissionBuilder()
      .setEmail(dto.email)
      .setTitle(dto.title)
      .setDescription(dto.description)
      .setTags(dto.tags)
      .setFileUrl(fileUrl)
      .setFileName(fileName)
      .setIsAiGenerated(isAiGenerated)
      .setStatus('pending');

    // Only set userId if provided
    if (userId) {
      submissionData.setUserId(userId);
    }

    const submissionDataBuilt = submissionData.build();

    // Save to database
    const submission = await this.prisma.submission.create({
      data: submissionDataBuilt,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return submission;
  }

  async getSubmissionById(id: number) {
    return this.prisma.submission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getAllSubmissions(skip: number = 0, take: number = 10) {
    return this.prisma.submission.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserSubmissions(userId: number) {
    return this.prisma.submission.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateSubmissionStatus(id: number, status: string) {
    return this.prisma.submission.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteSubmission(id: number) {
    return this.prisma.submission.delete({
      where: { id },
    });
  }
}
