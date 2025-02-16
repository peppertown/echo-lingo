import { Injectable } from '@nestjs/common';
import { DayjsService } from 'src/dayjs/dayjs.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dayjs: DayjsService,
  ) {}

  // 퀴즈 조회; 키워드에 따라 당일 복습 or 주기 복습
  async getQuiz(keyword: 'today' | 'interval') {
    const now = await this.dayjs.now();
    const startDate = await this.dayjs.startDate(now);
    const endDate = await this.dayjs.endDate(now);

    // 당일 복습; 당일에 등록한 단어만 복습
    return this.prisma.word.findMany({
      where:
        keyword == 'today'
          ? {
              created_at: {
                gte: startDate,
              },
            }
          : {
              next_review_date: {
                lte: endDate,
              },
            },
      select: {
        id: true,
        word: true,
        mean: true,
        level: true,
        interval: true,
        Sentence: {
          select: {
            id: true,
            sentence: true,
            mean: true,
          },
        },
      },
    });
  }
}
