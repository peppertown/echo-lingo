import { Controller, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // 당일 복습 퀴즈
  @Get('review')
  async reviewQuiz() {
    return this.quizService.reveiwQuiz();
  }
}
