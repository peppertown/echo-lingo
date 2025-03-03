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

  // 토픽 선정 후 대화 시작
  async startChat(topic: string) {
    const systemMessage = `너의 역할은 AI 영어 튜터야. 
    사용자가 토픽에 맞는 상황에서 영어 대화 연습을 할 수 있게 첫마디를 열어. 토픽 : ${topic}
    { content : "대화 내용 "} 이 형식을 지켜서 대답해.
    Output must be valid JSON, without extra symbols like backticks, and must be minified (no extra spaces or line breaks).`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: systemMessage }],
        temperature: 0.7,
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error starting chat:', error);
      throw new Error('대화 시작 중 오류 발생');
    }
  }

  // 사용자의 응답 검사
  async checkGrammer(topic: string, content: string) {
    const systemMessage = `너의 역할은 AI 영어 튜터야.
    해당 토픽에 대해 사용자의 content가 문법 및 어휘적으로 자연스러운지 판단하고
    자연스럽지 않다면 어떤부분이 문제인지 한글로 알려줘야해.
    토픽 : ${topic}, 지금까지 진행된 대화내용 : ${content}.

  { grammer : "자연스럽다면 true, 아니라면 설명"} 이 형식을 지켜서 대답해. grammer 말고 다른걸 추가하지마.
    Output must be valid JSON, without extra symbols like backticks, and must be minified (no extra spaces or line breaks). `;
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: systemMessage }],
        temperature: 0.3,
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error checking grammer:', error);
      throw new Error('사용자 응답 검사 중 오류 발생');
    }
  }

  // 다음 대화 응답
  async getNextContent(topic: string, contents) {
    const systemMessage = `너의 역할은 AI 영어 튜터야.
    지금까지 토픽에 대해 진행된 대화 내용을 파악해서 상황에 맞는 응답을 해야해
    토픽 : ${topic}, 지금까지 진행된 대화내용 : ${JSON.stringify(contents)}.

  { content : "응답"} 이 형식을 지켜서 대답해.
    Output must be valid JSON, without extra symbols like backticks, and must be minified (no extra spaces or line breaks). `;
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: systemMessage }],
        temperature: 0.3,
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating next content:', error);
      throw new Error('대화 응답 생성 중 오류 발생');
    }
  }
}
