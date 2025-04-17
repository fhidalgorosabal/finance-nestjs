import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenCleanerUtil {
  constructor(private prisma: PrismaService) {}

  @Cron('0 0 * * * *')
  async handleCron() {
    await this.prisma.blacklistedToken.deleteMany({
      where: {
        expiredAt: {
          lt: new Date(),
        },
      },
    });
    console.log('🧹 Tokens expirados eliminados de la blacklist');
  }
}
