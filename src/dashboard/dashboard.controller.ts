import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // 단어 레벨 통계
  @Get('word')
  async getWordsLevelStats() {
    return await this.dashboardService.getWordsLevelStats();
  }
}
