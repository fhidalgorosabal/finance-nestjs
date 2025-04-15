import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new BadRequestException('El email ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const payload = { sub: user.id, email: user.email };

    return {
      user,
      token: {
        access_token: this.jwtService.sign(payload),
        token_type: 'bearer',
        expires_in: 3600,
      },
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.validateUser(data.email, data.password);
    const payload = { sub: user.id, email: user.email };

    return {
      user,
      token: this.generateToken(payload),
    };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('El email o la contraseña son incorrectos.');
  }

  private generateToken(payload: any) {
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'bearer',
      expires_in: 3600,
    };
  }

  async profile(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
