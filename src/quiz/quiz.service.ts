import { Injectable } from '@nestjs/common';
import { DayjsService } from 'src/dayjs/dayjs.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dayjs: DayjsService,
  ) {}
}
