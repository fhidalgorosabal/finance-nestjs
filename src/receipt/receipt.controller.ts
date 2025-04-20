import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { Receipt } from '@prisma/client';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { ListReceiptsDto } from './dto/list-receipts.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { DataResponse } from 'src/common/utils/response.util';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReceiptDto: CreateReceiptDto): Promise<DataResponse<Receipt>> {
    return this.receiptService.create(createReceiptDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<DataResponse<Receipt[]>> {
    return this.receiptService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('list')
  @HttpCode(200)
  list(@Body() listReceiptsDto: ListReceiptsDto): Promise<DataResponse<Receipt[]>> {
    return this.receiptService.list(listReceiptsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DataResponse<Receipt>> {
    return this.receiptService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReceiptDto: UpdateReceiptDto,
  ): Promise<DataResponse<Receipt>> {
    return this.receiptService.update(id, updateReceiptDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<DataResponse<Receipt>> {
    return this.receiptService.remove(id);
  }
}
