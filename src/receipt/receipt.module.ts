import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
