import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WordModule } from './word/word.module';
import { OpenAiModule } from './openai/openai.module';
import { SentenceModule } from './sentence/sentence.module';
import { DayjsModule } from './dayjs/dayjs.module';
import { QuizModule } from './quiz/quiz.module';
import { ScrapModule } from './scrap/scrap.module';
import { ArticleModule } from './article/article.module';
import { ChatModule } from './chat/chat.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    WordModule,
    OpenAiModule,
    SentenceModule,
    DayjsModule,
    QuizModule,
    ScrapModule,
    ArticleModule,
    ChatModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
