import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ArtworkModule } from './artwork/artwork.module';
import { ForumModule } from './forum/forum.module';
import { NotificationModule } from './notification/notification.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, ArtworkModule, ForumModule, NotificationModule, PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
