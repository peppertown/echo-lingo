import { Controller, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // 당일 복습 퀴즈
  @Get('today')
  async todayReview() {
    return this.quizService.getQuiz('today');
  }

  @Get('interval')
  async intervalReview() {
    return this.quizService.getQuiz('interval');
  }
}
