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
}
