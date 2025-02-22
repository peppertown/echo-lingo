import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // 당일 복습 퀴즈
  @Get('today')
  async todayReview() {
    return this.quizService.getQuiz('today');
  }

  // 주기 복습 퀴즈
  @Get('interval')
  async intervalReview() {
    return this.quizService.getQuiz('interval');
  }

  // 퀴즈 결과 핸들러
  @Post('result')
  async handleQuiz(@Body() results) {
    return this.quizService.handleQuiz(results);
  }
}
