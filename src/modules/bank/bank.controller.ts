import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Bank } from '@prisma/client';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { DataResponse } from 'src/common/utils/response.util';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBankDto: CreateBankDto): Promise<DataResponse<Bank>> {
    return this.bankService.create(createBankDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<DataResponse<Bank[]>> {
    return this.bankService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DataResponse<Bank>> {
    return this.bankService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBankDto: UpdateBankDto
  ): Promise<DataResponse<Bank>> {
    return this.bankService.update(id, updateBankDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<DataResponse<Bank>> {
    return this.bankService.remove(id);
  }
}
