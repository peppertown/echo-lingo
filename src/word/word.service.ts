import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WordService {
  constructor(private readonly prisma: PrismaService) {}

  async getWords(date: string) {
    // date를 UTC 기준의 시작 날짜로 설정
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    // Prisma 쿼리
    const words = await this.prisma.word.findMany({
      where: {
        created_at: {
          gte: startDate, // UTC 기준 시작 시간
          lte: endDate, // UTC 기준 종료 시간
        },
      },
      select: {
        id: true,
        word: true,
        mean: true,
        isGenerated: true,
      },
    });

    return words;
  }
}
