import { Controller, Post, Body, Get, UseGuards, Request, HttpCode } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { Payload } from './entities';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Request() req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || '';

    const user = req.user as Payload;

    return this.authService.refresh(user, token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log(req.user);

    return this.authService.profile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Request() req: ExpressRequest) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || '';

    return this.authService.logout(token);
  }
}
