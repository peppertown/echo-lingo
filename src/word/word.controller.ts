import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  // 단어 전체 조회
  @Get()
  async getAllWords() {
    return await this.wordService.getAllWords();
  }

  // 단어 추가
  @Post()
  async create(@Body() createWordDto: CreateWordDto) {
    return await this.wordService.create(createWordDto);
  }

  // 단어 검색
  @Get('search/:keyword')
  searchWord(@Param('keyword') keyword: string) {
    return this.wordService.searchWord(keyword);
  }

  // 단어 날짜별 조회
  @Get('date/:date')
  getWordsByDate(@Param('date') date: string) {
    return this.wordService.getWordsByDate(date);
  }

  // 단어 수정
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateWordDto: UpdateWordDto) {
    return this.wordService.update(id, updateWordDto);
  }

  // 단어 삭제
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.wordService.remove(id);
  }
}
