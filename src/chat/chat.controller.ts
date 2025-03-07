import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 토픽 선정 후 대화 시작
  @Get(':topic')
  async selectTopic(@Param('topic') topic: string) {
    return await this.chatService.selectTopic(topic);
  }

  @Post(':topic/user')
  async test(@Param('topic') topic: string, @Body() body) {
    return await this.chatService.handleUserChat(topic, body.content);
  }
}
