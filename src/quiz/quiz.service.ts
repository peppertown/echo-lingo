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
                lte: endDate,
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

  // interval (복습 주기) 초기화 / 퀴즈 오답 시
  async initializeInterval(words) {
    const ids = words.map((word) => word.id);
    await this.prisma.word.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        interval: 1,
      },
    });
  }

  // 단어 난이도 별 복습주기 계산
  async calculateInterval(word) {
    const { level, interval } = word;

    let nextInterval;

    if (level == 'C1' || level == 'C2') {
      nextInterval = Math.ceil(interval * 1.5);
    } else if (level == 'B1' || level == 'B2') {
      nextInterval = interval * 2;
    } else {
      nextInterval = interval * 3;
    }

    // 30일을 넘어갈 시 30일로 return
    return nextInterval > 30 ? 30 : nextInterval;
  }
}
