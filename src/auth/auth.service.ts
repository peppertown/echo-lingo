import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  signup = (signupDto: SignupDto) => {
    const { email, password, nickname } = signupDto;
    console.log({ email, password, nickname });
    try {
      const result = this.prisma.user.create({
        data: { email, password, nickname },
      });
      return result;
    } catch (err) {
      return err;
    }
  };

  getUsers = () => {
    return this.prisma.user.findMany();
  };
}
