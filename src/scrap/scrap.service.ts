import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScrapService {
  constructor(private readonly prisma: PrismaService) {}

  // 스크랩 핸들러
  async handleWordScrap(id: number) {
    const word = await this.prisma.word.findFirst({
      where: { id },
      select: { is_scrapped: true },
    });

    if (word.is_scrapped) {
      await this.prisma.word.update({
        where: { id },
        data: { is_scrapped: false },
      });
      return { success: true, message: '스크랩이 해제되었습니다.' };
    } else {
      await this.prisma.word.update({
        where: { id },
        data: { is_scrapped: true },
      });
      return { success: true, message: '스크랩 되었습니다.' };
    }
  }

  // 스크랩 단어 조회
  async getScrapWords() {
    return await this.prisma.word.findMany({
      where: { is_scrapped: true },
      include: { Sentence: true },
    });
  }
}
