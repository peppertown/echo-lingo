import { Module } from '@nestjs/common';
import { ScarpService } from './scarp.service';
import { ScarpController } from './scarp.controller';

@Module({
  controllers: [ScarpController],
  providers: [ScarpService],
})
export class ScarpModule {}
