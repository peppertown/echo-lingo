import { Injectable } from '@nestjs/common';
import { OpenAiService } from 'src/openai/openai.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SentenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openai: OpenAiService,
  ) {}
  async createSentence(words) {
    // 예문 생성
    const result = await this.openai.generateExampleSentences(words);

    const wordsIds = [];

    // 예문 생성 후 파싱 및 id 추가
    const sentences = [];
    for (let i = 0; i < result.length; i++) {
      const ex = JSON.parse(result[i].result)[0];
      wordsIds.push(words[i].id);
      ex.word_id = words[i].id;
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
}
