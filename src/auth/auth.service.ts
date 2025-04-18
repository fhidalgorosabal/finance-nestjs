import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { env } from 'src/config';
import { responseData, responseError } from 'src/common/utils/response.util';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterDto) {
    try {
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

      const { password, ...safeUser } = user;

      return responseData(
        {
          user: safeUser,
          token: this.generateToken(payload),
        },
        'Usuario registrado correctamente.',
        201
      );
    } catch (error) {
      return responseError(error, 'No se pudo registrar el usuario.');
    }
  }

  async login(data: { email: string; password: string }) {
    try {
      const user = await this.validateUser(data.email, data.password);

      const payload = { sub: user.id, email: user.email };

      const { password, ...safeUser } = user;

      return responseData(
        {
          user: safeUser,
          token: this.generateToken(payload),
        },
        'Usuario autenticado correctamente.'
      );
    } catch (error) {
      return responseError(error, 'Credenciales incorrectas.', 401);
    }
  }

  refresh(user: any) {
    try {
      const payload = { sub: user.id, email: user.email };

      const token = this.generateToken(payload);

      return responseData({ token }, 'Token de actualización.');
    } catch (error) {
      return responseError(error, 'No se pudo refrescar el token.');
    }
  }

  async profile(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new UnauthorizedException('Usuario no encontrado.');

      const { password, ...safeUser } = user;

      return responseData(
        {
          user: safeUser,
        },
        'Usuario autenticado.'
      );
    } catch (error) {
      return responseError(error, 'No se pudo obtener el perfil.', 401);
    }
  }

  logout(token: string) {
    if (token !== '') this.blacklistToken(token);

    return responseData([], 'Se ha cerrado la sesión correctamente.');
  }

  private async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    throw new UnauthorizedException('El email o la contraseña son incorrectos.');
  }

  private generateToken(payload: any) {
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'bearer',
      expires_in: env.expiresIn,
    };
  }

  private async blacklistToken(token: string) {
    const decoded: any = this.jwtService.decode(token);
    const expiredAt = new Date(decoded.exp * 1000);

    await this.prisma.blacklistedToken.create({
      data: {
        token,
        expiredAt,
      },
    });
  }
}
