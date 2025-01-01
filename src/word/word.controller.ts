import { Controller, Get, Param } from '@nestjs/common';
import { WordService } from './word.service';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get(':date')
  getWords(@Param('date') date: string) {
    return this.wordService.getWords(date);
  }
}
