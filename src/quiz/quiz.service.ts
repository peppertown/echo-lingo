import { Injectable } from '@nestjs/common';
import { DayjsService } from 'src/dayjs/dayjs.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dayjs: DayjsService,
  ) {}

  // 당일 복습 퀴즈
  async reveiwQuiz() {
    const now = await this.dayjs.now();
    const startDate = await this.dayjs.startDate(now);
    const endDate = await this.dayjs.endDate(now);

    return this.prisma.word.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { Sentence: true },
    });
  }
}
