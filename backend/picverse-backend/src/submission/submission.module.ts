import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { FileUploadService } from './file-upload.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubmissionController],
  providers: [SubmissionService, FileUploadService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
