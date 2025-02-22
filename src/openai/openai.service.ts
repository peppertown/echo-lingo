import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
}
