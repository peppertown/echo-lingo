import { Body, Controller, Get, Post } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // 아티클 생성
  @Post()
  async createArticle(@Body() body) {
    return await this.articleService.createArticle(body.level);
  }

  // 아티클 전체 조회
  @Get()
  async getArticles() {
    return await this.articleService.getArticles();
  }
}
