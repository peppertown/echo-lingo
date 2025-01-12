import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SentenceService } from './sentence.service';

@Controller('sentence')
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  // 예문 생성
  @Post()
  async createSentence(@Body() words) {
    return await this.sentenceService.createSentence(words);
  }

  // 예문 날짜별 조회
  @Get(':date')
  async getSentenceByDate(@Param('date') date: string) {
    return await this.sentenceService.getSentenceByDate(date);
  }
  // 아이디별 조회
  // 재생성
}
