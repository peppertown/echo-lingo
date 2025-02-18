import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAiService } from './openai.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
