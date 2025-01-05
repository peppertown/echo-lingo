import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { WordDto } from './word.dto';

export class UpdateWordDto extends PartialType(WordDto) {
  @IsOptional()
  @IsNotEmpty({ message: '수정할 내용을 입력해주세요.' })
  word?: string;

  @IsOptional()
  @IsNotEmpty({ message: '수정할 내용을 입력해주세요.' })
  mean?: string;
}
