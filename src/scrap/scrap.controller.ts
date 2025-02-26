import { Controller, Param, Post } from '@nestjs/common';
import { ScrapService } from './scrap.service';

@Controller('scrap')
export class ScrapController {
  constructor(private readonly scarpService: ScrapService) {}

  // 단어 스크랩
  @Post(':id')
  handleWordScrap(@Param('id') id: number) {
    return this.scarpService.handleWordScrap(id);
  }
}
