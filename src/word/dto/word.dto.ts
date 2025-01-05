import { IsNotEmpty, IsString } from 'class-validator';

export class WordDto {
  @IsString({ message: '단어는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '단어를 입력해주세요.' })
  word: string;

  @IsString({ message: '뜻은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '뜻을 입력해주세요.' })
  mean: string;
}
