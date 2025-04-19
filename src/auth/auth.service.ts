import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { env } from 'src/config';
import {
  DataResponse,
  responseData,
  responseError,
} from 'src/common/utils/response.util';
import {
  AuthResponse,
  Payload,
  TokenResponse,
  UserResponse,
} from './entities/auth.entity';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterDto): Promise<DataResponse<AuthResponse>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw responseError(new ConflictException(), 'El correo ya está registrado.', HttpStatus.CONFLICT);
    }

    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          companyId: data.companyId,
        },
      });

      return responseData(
        this.buildAuthResponse(user),
        'Usuario registrado correctamente.',
        201
      );
    } catch (error) {
      throw responseError(error, 'No se pudo registrar el usuario.');
    }
  }

  async login(data: { email: string; password: string }): Promise<DataResponse<AuthResponse>> {
    try {
      const user = await this.validateUser(data.email, data.password);
      return responseData(
        this.buildAuthResponse(user),
        'Usuario autenticado correctamente.'
      );
    } catch (error) {
      throw responseError(error, 'Credenciales incorrectas.', 401);
    }
  }

  async refresh(payload: Payload, token: string): Promise<DataResponse<TokenResponse>> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: payload.sub },
      });

      if (token !== '') {
        await this.blacklistToken(token);
      }

      const newPayload: Payload = { sub: user.id, email: user.email };
      const newToken = this.generateToken(newPayload);

      return responseData(
        { token: newToken },
        'Token actualizado correctamente.'
      );
    } catch (error) {
      throw responseError(error, 'No se pudo refrescar el token.');
    }
  }

  async profile(sub: number): Promise<DataResponse<UserResponse>> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: sub },
      });
      return responseData(
        { user: this.safeUser(user) },
        'Usuario autenticado.'
      );
    } catch (error) {
      throw responseError(error, 'No se pudo obtener el perfil.');
    }
  }

  async logout(token: string): Promise<DataResponse<null>> {
    if (!token) {
      throw responseError(
        new BadRequestException(),
        'Token incorrecto.',
        HttpStatus.BAD_REQUEST
      );
    }

    await this.blacklistToken(token);

    return responseData(null, 'Se ha cerrado la sesión correctamente.');
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    throw responseError(
      new UnauthorizedException, 
      'El correo o la contraseña son incorrectos.', 
      HttpStatus.UNAUTHORIZED
    );
  }

  private buildAuthResponse(user: User): AuthResponse {
    const payload: Payload = { sub: user.id, email: user.email };
    return {
      user: this.safeUser(user),
      token: this.generateToken(payload),
    };
  }

  private safeUser(user: UserResponse): UserResponse {
    const safeUser: UserResponse = { ...user };
    delete safeUser.password;
    return safeUser;
  }

  private generateToken(payload: Payload): TokenResponse {
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'bearer',
      expires_in: env.expiresIn,
    };
  }

  private async blacklistToken(token: string): Promise<void> {
    const decoded = this.jwtService.decode(token) as { exp: number };
    const expiredAt = new Date(decoded.exp * 1000);

    await this.prisma.blacklistedToken.create({
      data: {
        token,
        expiredAt,
      },
    });
  }
}
