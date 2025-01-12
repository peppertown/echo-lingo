import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DayjsModule } from 'src/dayjs/dayjs.module';

@Module({
  imports: [PrismaModule, DayjsModule],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule {}
