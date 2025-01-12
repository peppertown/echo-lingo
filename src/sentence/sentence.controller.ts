import { Body, Controller, Post } from '@nestjs/common';
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
  // 아이디별 조회
  // 재생성
}
