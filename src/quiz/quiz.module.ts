import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DayjsModule } from 'src/dayjs/dayjs.module';

@Module({
  imports: [PrismaModule, DayjsModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
