import { Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DayjsService } from 'src/dayjs/dayjs.service';
import { OpenAiService } from 'src/openai/openai.service';

@Injectable()
export class WordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dayjs: DayjsService,
    private readonly openai: OpenAiService,
  ) {}

  // 단어 전체 조회
  async getAllWords() {
    return await this.prisma.word.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 5,
    });
  }

  // 단어 추가
  async create(createWordDto: CreateWordDto) {
    const now = await this.dayjs.now();
    const tomorrow = await this.dayjs.tomorrow(now);

    const evaluateLevel = await this.openai.evaluateWordLevel(
      createWordDto.words,
    );
    const words = JSON.parse(evaluateLevel);
    await this.prisma.word.createMany({
      data: words.map((word) => ({
        ...word,
        created_at: now,
        next_review_date: tomorrow,
        interval: 1,
      })),
    });
    return { message: '등록이 완료되었습니다' };
  }

  // 단어 날짜별 조회
  async getWordsByDate(date: string) {
    // date를 UTC 기준의 시작 날짜로 설정
    const startDate = await this.dayjs.startDate(date);
    const endDate = await this.dayjs.endDate(date);

    // Prisma 쿼리
    const words = await this.prisma.word.findMany({
      where: {
        created_at: {
          gte: startDate, // UTC 기준 시작 시간
          lte: endDate, // UTC 기준 종료 시간
        },
      },
    });

    return words;
  }

  // 단어 수정
  async update(id: number, updateWordDto: UpdateWordDto) {
    await this.prisma.word.update({
      where: { id },
      data: { ...updateWordDto },
    });

    return { message: '수정이 완료됐습니다.' };
  }

  // 단어 삭제
  async remove(id: number) {
    await this.prisma.$transaction([
      this.prisma.sentence.deleteMany({
        where: { word_id: id },
      }),
      this.prisma.word.delete({
        where: { id },
      }),
    ]);

    return { message: '삭제되었습니다.' };
  }

  // id 배열로 단어 데이터 조회
  async getWordsByIds(ids: number[]) {
    return await this.prisma.word.findMany({
      where: { id: { in: ids } },
    });
  }

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
}
