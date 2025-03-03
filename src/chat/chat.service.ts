import { Injectable } from '@nestjs/common';
import { OpenAiService } from 'src/openai/openai.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly openai: OpenAiService,
    private readonly prisma: PrismaService,
  ) {}

  // 토픽 선정 후 대화 시작
  async selectTopic(topic: string) {
    const content = await this.openai.startChat(topic);

    await this.prisma.chat_messages.create({
      data: { content: content.content, role: 'system' },
    });

    return content;
  }

  // 유저 채팅 핸들러
  async handleUserChat(topic: string, content: string) {
    const checkResult = await this.openai.checkGrammer(topic, content);
    // 사용자 응답 문법&어휘 체크
    if (checkResult.grammer !== 'true') {
      // 자연스럽지 않다면 checkResult 리턴
      return checkResult;
    }

    // 사용자 응답 DB 저장
    await this.prisma.chat_messages.create({
      data: { role: 'user', content },
    });

    // 현재까지 대화 불러오기
    const currentContents = await this.prisma.chat_messages.findMany();

    // 다음 응답 생성
    const nextContent = await this.openai.getNextContent(
      topic,
      currentContents,
    );

    // 응답 DB 저장
    await this.prisma.chat_messages.create({
      data: { role: 'system', content: nextContent.content },
    });

    return nextContent;
  }
}
