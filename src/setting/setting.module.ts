import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
