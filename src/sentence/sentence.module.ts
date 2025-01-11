import { Module } from '@nestjs/common';
import { SentenceService } from './sentence.service';
import { SentenceController } from './sentence.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OpenAiModule } from 'src/openai/openai.module';

@Module({
  imports: [PrismaModule, OpenAiModule],
  controllers: [SentenceController],
  providers: [SentenceService],
})
export class SentenceModule {}
