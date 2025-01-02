import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WordService } from './word.service';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get(':date')
  getWords(@Param('date') date: string) {
    return this.wordService.getWords(date);
  }

  @Post()
  addWords(@Body() wordList) {
    return this.wordService.addWord(wordList);
  }
}
