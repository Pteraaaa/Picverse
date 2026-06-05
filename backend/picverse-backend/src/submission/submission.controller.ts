import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import type { UploadFile } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dtos/create.submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('artwork'))
  @HttpCode(HttpStatus.CREATED)
  async createSubmission(
    @Body() dto: CreateSubmissionDto,
    @UploadedFile() file: UploadFile,
  ) {
    // userId is optional - extract from JWT in real app
    const userId = dto.userId ? parseInt(dto.userId as any, 10) : undefined;

    const submission = await this.submissionService.createSubmission(
      dto,
      file,
      userId,
    );

    return {
      message: 'Submission created successfully',
      data: submission,
    };
  }

  @Get(':id')
  async getSubmission(@Param('id') id: string) {
    const submission = await this.submissionService.getSubmissionById(parseInt(id));

    if (!submission) {
      throw new BadRequestException('Submission not found');
    }

    return {
      data: submission,
    };
  }

  @Get()
  async getAllSubmissions(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? parseInt(skip) : 0;
    const takeNum = take ? parseInt(take) : 10;

    const submissions = await this.submissionService.getAllSubmissions(skipNum, takeNum);

    return {
      data: submissions,
      count: submissions.length,
    };
  }

  @Get('user/:userId')
  async getUserSubmissions(@Param('userId') userId: string) {
    const submissions = await this.submissionService.getUserSubmissions(parseInt(userId));

    return {
      data: submissions,
      count: submissions.length,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const submission = await this.submissionService.updateSubmissionStatus(
      parseInt(id),
      body.status,
    );

    return {
      message: 'Submission status updated',
      data: submission,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSubmission(@Param('id') id: string) {
    await this.submissionService.deleteSubmission(parseInt(id));
    return null;
  }
}
