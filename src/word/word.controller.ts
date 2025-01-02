import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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

  @Put(':id')
  updateWord(@Param('id') id: number, @Body() wordData) {
    return this.wordService.updateWord(id, wordData);
  }

  @Delete(':id')
  deleteWord(@Param('id') id: number) {
    return this.wordService.deleteWord(id);
  }
}
