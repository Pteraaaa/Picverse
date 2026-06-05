import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ArtworkModule } from './artwork/artwork.module';
import { ForumModule } from './forum/forum.module';
import { NotificationModule } from './notification/notification.module';
import { SubmissionModule } from './submission/submission.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [AuthModule, ArtworkModule, ForumModule, NotificationModule, SubmissionModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
