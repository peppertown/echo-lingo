import { Body, Controller, Post } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // 아티클 생성
  @Post()
  async createArticle(@Body() body) {
    return await this.articleService.createArticle(body.level);
  }
}
