import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { ReceiptUtil } from './utils/receipt.util';

@Module({
  imports: [PrismaModule],
  controllers: [ReceiptController],
  providers: [ReceiptService, ReceiptUtil],
})
export class ReceiptModule {}
