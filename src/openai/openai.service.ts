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

  async generateExampleSentences(
    words: { word: string; definition: string }[],
  ): Promise<any[]> {
    const sentences = [];
    const systemMessage = `For each word and definition, generate a single object with:
- "sentence": A single clear example sentence using the word in context, with the word replaced by a blank (_____).
- "mean": The Korean translation of the example sentence.
Ensure the example sentence is grammatically and lexically accurate, and use natural, meaningful contexts only.
Output must be valid JSON, without extra symbols like backticks, and must be minified (no extra spaces or line breaks).`;

    for (const word of words) {
      const { word: currentWord, definition } = word;

      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemMessage },
            {
              role: 'user',
              content: `Word: ${currentWord}, Definition: ${definition}`,
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
}
