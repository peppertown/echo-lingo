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
  // 예문 개별 조회
  @Get('id/:id')
  async getSentenceById(@Param('id') id: number) {
    return await this.sentenceService.getSentenceById(id);
  }
  // 재생성
}
