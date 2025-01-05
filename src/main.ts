import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO 클래스에 정의되지 않은 프로퍼티를 자동으로 제거
      forbidNonWhitelisted: true, // 허용되지 않은 프로퍼티가 요청에 포함되면 예외를 발생시킴
      transform: true, // 요청 데이터를 DTO 클래스의 인스턴스로 자동 변환
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
