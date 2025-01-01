import { IsString } from 'class-validator';

export class WordDto {
  @IsString({ message: '단어를 입력해주세요' })
  word: string;

  @IsString({ message: '뜻을 입력해주세요' })
  mean: string;
}
