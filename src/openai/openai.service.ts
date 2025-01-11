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
    const systemMessage = `
      For each given word and definition, generate a JSON array where each object contains:
      - "sentence": A single clear example sentence using the word in a meaningful context. In the example sentence, replace the given word with a blank (_____).
      - "mean": The Korean translation of the example sentence.
      Ensure the example sentence is grammatically and lexically accurate, and use natural, meaningful contexts only. The output should be compact and must not include unnecessary line breaks, indentation, or extra formatting. The JSON should be minified.
    `;

    for (const word of words) {
      const { word: currentWord, definition } = word;

      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
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
