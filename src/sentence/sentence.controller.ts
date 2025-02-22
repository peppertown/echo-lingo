import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SentenceService } from './sentence.service';

@Controller('sentence')
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  // 예문 생성
  @Post()
  async createSentence(@Body() ids: number[]) {
    return await this.sentenceService.createSentence(ids);
  }

  // 예문 날짜별 조회
  @Get(':date')
  async getSentenceByDate(@Param('date') date: string) {
    return await this.sentenceService.getSentenceByDate(date);
  }
  // 예문 개별 조회
  @Get('id/:id')
  async getSentenceById(@Param('id') wordId: number) {
    return await this.sentenceService.getSentenceById(wordId);
  }
  // 재생성
  @Put('id/:id')
  async updateSentence(@Param('id') wordId: number) {
    return await this.sentenceService.updateSentence(wordId);
  }
}
