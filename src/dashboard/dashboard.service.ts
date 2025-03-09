import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // 단어 레벨 통계
  async getWordsLevelStats() {
    const result = await this.prisma.word.groupBy({
      by: ['level'],
      _count: {
        id: true,
      },
    });

    return result.map((res) => ({
      level: res.level,
      count: res._count.id,
    }));
  }
}
