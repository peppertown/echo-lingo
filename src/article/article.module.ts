import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OpenAiModule } from 'src/openai/openai.module';

@Module({
  imports: [PrismaModule, OpenAiModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
