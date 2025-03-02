import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // 아티클 생성
  @Post()
  async createArticle(@Body() body: { category: string; level: string }) {
    const { category, level } = body;
    return await this.articleService.createArticle(category, level);
  }

  // 아티클 전체 조회
  @Get()
  async getArticles() {
    return await this.articleService.getArticles();
  }

  // 아티클 레벨별 조회
  @Get('level/:level')
  async getArticlesByLevel(@Param('level') level: string) {
    return await this.articleService.getArticlesByLevel(level);
  }
}
