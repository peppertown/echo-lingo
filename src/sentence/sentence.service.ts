import { Injectable } from '@nestjs/common';
import { DayjsService } from 'src/dayjs/dayjs.service';
import { OpenAiService } from 'src/openai/openai.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SentenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openai: OpenAiService,
    private readonly dayjs: DayjsService,
  ) {}
  async createSentence(ids: number[]) {
    const words = await this.prisma.word.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        word: true,
        mean: true,
      },
    });

    // 예문 생성
    const result = await this.openai.generateExampleSentences(words);
    // created_at
    const now = await this.dayjs.now();

    const wordsIds = [];

    // 예문 생성 후 파싱 및 id 추가
    const sentences = [];
    for (let i = 0; i < result.length; i++) {
      const ex = JSON.parse(result[i].result);
      wordsIds.push(words[i].id);
      ex.word_id = words[i].id;
      ex.created_at = now;
      sentences.push(ex);
    }

    // 예문 DB 저장
    await this.prisma.sentence.createMany({
      data: sentences,
    });

    // 단어 데이터 수정
    await this.prisma.word.updateMany({
      where: {
        id: { in: wordsIds },
      },
      data: {
        isGenerated: true,
      },
    });

    return { success: true, message: '예문 생성이 완료되었습니다' };
  }

  // 날짜별 예문 조회
  async getSentenceByDate(date) {
    const startDate = await this.dayjs.startDate(date);
    const endDate = await this.dayjs.endDate(date);

    const sentences = await this.prisma.sentence.findMany({
      where: {
        created_at: {
          gte: startDate, // UTC 기준 시작 시간
          lte: endDate, // UTC 기준 종료 시간
        },
      },
      include: { word: true },
    });

    return sentences;
  }

  // 예문 개별 조회
  async getSentenceById(id: number) {
    return await this.prisma.sentence.findFirst({
      where: { word_id: id },
      include: { word: true },
    });
  }

  // 예문 재생성
  async updateSentence(wordId: number) {
    const word = await this.prisma.word.findUnique({
      where: { id: wordId },
      select: { word: true, mean: true },
    });

    const result = await this.openai.regenerateExample(word);

    const sentence = JSON.parse(result);

    await this.prisma.sentence.updateMany({
      where: { word_id: wordId },
      data: { sentence: sentence.sentence, mean: sentence.mean },
    });

    return { success: true, message: '예문이 재생성되었습니다.' };
  }
}
