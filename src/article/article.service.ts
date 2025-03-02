import { Injectable } from '@nestjs/common';
import { OpenAiService } from 'src/openai/openai.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openai: OpenAiService,
  ) {}

  // 레벨별 아티클 생성
  async createArticle(level: string) {
    const responseData = await this.openai.generateArticle(level);

    // JSON 내부 개행문자 제거
    const cleanedData = responseData.replace(/[\n\r]/g, ' ');

    // JSON 파싱
    const article = JSON.parse(cleanedData);

    await this.prisma.article.create({
      data: { ...article },
    });

    return { success: true, message: '아티클 생성이 완료되었습니다.' };
  }
}
