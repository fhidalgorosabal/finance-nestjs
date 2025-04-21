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
import { 
  AuthResponse, 
  Login, 
  Payload, 
  TokenResponse, 
  UserResponse,
} from './entities/auth.entity';
import { DataResponse } from 'src/common/utils/response.util';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto): Promise<DataResponse<AuthResponse>> {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: Login): Promise<DataResponse<AuthResponse>> {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Request() req): Promise<DataResponse<TokenResponse>> {
    const user = req.user as Payload;
    return this.authService.refresh(user, this.getTokenFromHeader(req));
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<DataResponse<UserResponse>> {
    return this.authService.profile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Request() req: ExpressRequest): Promise<DataResponse<null>> {
    return this.authService.logout(this.getTokenFromHeader(req));
  }

  private getTokenFromHeader(req: ExpressRequest): string {
    const authHeader = req.headers['authorization'];
    return authHeader?.split(' ')[1] || '';
  }
}
