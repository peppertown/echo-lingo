import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DayjsModule } from 'src/dayjs/dayjs.module';
import { WordModule } from 'src/word/word.module';

@Module({
  imports: [PrismaModule, DayjsModule, WordModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
