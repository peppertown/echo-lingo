import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OpenAiModule } from 'src/openai/openai.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [OpenAiModule, PrismaModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
