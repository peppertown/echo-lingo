import { Body, Controller, Post } from '@nestjs/common';
import { SentenceService } from './sentence.service';

@Controller('sentence')
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  // 예문 생성
  @Post()
  createSentence(@Body() words) {
    return this.sentenceService.createSentence(words);
  }
}
