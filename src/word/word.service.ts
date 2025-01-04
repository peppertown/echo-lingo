import { Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WordService {
  constructor(private readonly prisma: PrismaService) {}
  getAllWords() {
    return this.prisma.word.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  create(createWordDto: CreateWordDto) {
    return 'This action adds a new word';
  }

  findOne(id: number) {
    return `This action returns a #${id} word`;
  }

  update(id: number, updateWordDto: UpdateWordDto) {
    return `This action updates a #${id} word`;
  }

  remove(id: number) {
    return `This action removes a #${id} word`;
  }
}
