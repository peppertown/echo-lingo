import { WordDto } from './word.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWordDto {
  @IsArray() // 배열이어야 함을 명시
  @ValidateNested({ each: true }) // 배열의 각 요소를 유효성 검사
  @Type(() => WordDto) // 각 요소를 WordDto로 변환
  words: WordDto[];
}
