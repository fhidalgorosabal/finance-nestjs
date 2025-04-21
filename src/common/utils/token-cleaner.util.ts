import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class TokenCleanerUtil {
  private readonly logger = new Logger('TokenCleanerUtil');

  constructor(private prisma: PrismaService) {}

  @Cron('0 0 * * * *')
  async handleCron() {
    try {
      const result = await this.prisma.blacklistedToken.deleteMany({
        where: {
          expiredAt: {
            lt: new Date(),
          },
        },
      });
      this.logger.log(`Eliminados ${result.count} tokens expirados de la blacklist`);
    } catch (error) {
      this.logger.error('Error al limpiar tokens expirados', error.stack);
    }
  }
}