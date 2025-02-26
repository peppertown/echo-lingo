import { Controller } from '@nestjs/common';
import { ScarpService } from './scarp.service';

@Controller('scarp')
export class ScarpController {
  constructor(private readonly scarpService: ScarpService) {}
}
