import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원 가입
  @Post('signup')
  join(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
