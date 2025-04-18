import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Request, 
  HttpCode,  
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { Login, Payload } from './entities/auth.entity';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: Login) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Request() req) {
    const user = req.user as Payload;
    return this.authService.refresh(user, this.getTokenFromHeader(req));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.profile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Request() req: ExpressRequest) {
    return this.authService.logout(this.getTokenFromHeader(req));
  }

  private getTokenFromHeader(req: ExpressRequest): string {
    const authHeader = req.headers['authorization'];
    return authHeader?.split(' ')[1] || '';
  }
}
