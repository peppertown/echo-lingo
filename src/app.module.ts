import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WordModule } from './word/word.module';

@Module({
  imports: [PrismaModule, WordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
