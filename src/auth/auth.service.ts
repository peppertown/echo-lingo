import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(signupDto: SignupDto) {
    const { email, password, nickname } = signupDto;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword, nickname },
      });
      return { message: '회원가입이 완료되었습니다', ID: user.id };
    } catch (err) {
      return err;
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const isExist = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!isExist || !(await bcrypt.compare(password, isExist.password))) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다',
      );
    }

    return { message: '로그인 성공' };
  }
}
