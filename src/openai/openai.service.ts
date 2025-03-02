import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey });
  }

  // 예문 생성
  async generateExampleSentences(
    words: { word: string; mean: string }[],
  ): Promise<any[]> {
    const sentences = [];
    const systemMessage = `For each word and definition, generate a single object with:
- "sentence": A single clear example sentence using the word in context, with the word replaced by a blank (_____).
- "mean": The Korean translation of the example sentence.
Ensure the example sentence is grammatically and lexically accurate, and use natural, meaningful contexts only.
Output must be valid JSON, without extra symbols like backticks, and must be minified (no extra spaces or line breaks).`;

    for (const word of words) {
      const { word: currentWord, mean } = word;

      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemMessage },
            {
              role: 'user',
              content: `Word: ${currentWord}, Definition: ${mean}`,
            },
          ],
          temperature: 0.7,
        });
        sentences.push({
          result: response.choices[0].message.content,
        });
        console.log(response.choices[0].message.content);
      } catch (error) {
        console.error(
          `Error generating sentence for word "${currentWord}":`,
          error,
        );
      }
    }
    return sentences;
  }

  async regenerateExample(word: { word: string; mean: string }) {
    const systemMessage = `For the given word and meaning, generate a single object with:
      - "sentence": A single clear example sentence using the word in context, with the word replaced by a blank (_____).
      - "mean": The Korean translation of the example sentence.
      Ensure the example sentence is grammatically and lexically accurate, and uses natural, meaningful contexts only.
      The sentence must match the provided meaning precisely. If the generated sentence does not match the intended meaning, regenerate it until it does.
      Output must be valid JSON, without extra symbols like backticks, and must be minified (no extra spaces or line breaks).
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          {
            role: 'user',
            content: `Word: ${word.word}, Definition: ${word.mean}`,
          },
        ],
        temperature: 0.7,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error(`Error generating sentence for word "${word}":`, error);
    }
  }

  // 단어 난이도 측정
  async evaluateWordLevel(words: { word: string; mean: string }[]) {
    const systemMessage = `For each word and its meaning, return the CEFR level (A1-C2):
  - A1 or A2: Basic meaning
  - B1 or B2: Moderate complexity
  - C1 or C2: Advanced or specific meaning
  Return a JSON array with each object containing:
  - "word": the word
  - "mean": the provided meaning
  - "level": the CEFR level
  Output must be valid JSON, without extra symbols like backticks, and must be minified (no extra spaces or line breaks).`;

    try {
      const wordListMessage = words
        .map((w) => `Word: ${w.word}, Meaning: ${w.mean}`)
        .join('\n');

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          {
            role: 'user',
            content: `Word list with meanings:\n${wordListMessage}`,
          },
        ],
        temperature: 0.3,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching CEFR levels:', error);
      throw new Error('CEFR 정보를 가져오는 중 오류 발생');
    }
  }

  async findWordsMeaning(word: string) {
    const systemMessage = `이 영어단어의 한국말 뜻을 2~3개 알려줘. 뜻이 뭔지만`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          {
            role: 'user',
            content: word,
          },
        ],
        temperature: 0.2,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching word mean:', error);
      throw new Error('단어 정보를 가져오는 중 오류 발생');
    }
  }

  // 아티클 생성
  async generateArticle(category: string, level: string) {
    const systemMessage = `CEFR 표준을 참고하여 레벨 ${level} 수준으로
    ${category} 주제에 대한 영어 아티클을 4~5줄 분량으로 작성해줘. 거짓 정보가 포함되면 안 돼. 

아래 JSON 형식을 엄격하게 지켜서 응답해야 해:
{
  "title" : "아티클 제목",
  "article": "아티클 내용",
  "interpretation": "아티클 내용 한글 해석",
  "level": "아티클의 난이도"
}

Output must be valid JSON, without extra symbols like backticks, and must be minified (no extra spaces or line breaks).`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: systemMessage }],
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating article:', error);
      throw new Error('아티클 생성 중 오류 발생');
    }
  }

  async transcribeAudio(filePath: string): Promise<string> {
    try {
      const audioStream = createReadStream(filePath);
      const response = await this.openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: audioStream,
        language: 'en', // 한국어는 'ko'
      });

      return response.text; // 변환된 텍스트 반환
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('음성 변환 실패');
    }
  }
}
