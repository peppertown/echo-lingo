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

  @Get()
  async getAllWords() {
    return await this.wordService.getAllWords();
  }

  @Post()
  async create(@Body() createWordDto: CreateWordDto) {
    return await this.wordService.create(createWordDto);
  }

  @Get(':date')
  getWordsByDate(@Param('date') date: string) {
    return this.wordService.getWordsByDate(date);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateWordDto: UpdateWordDto) {
    return this.wordService.update(id, updateWordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wordService.remove(+id);
  }
}
