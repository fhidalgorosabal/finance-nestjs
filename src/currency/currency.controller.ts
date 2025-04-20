import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { ListCurrencyDto } from './dto/list-currency.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { DefaultCurrencyDto } from './dto/default-currency.dto';
import { DataResponse } from 'src/common/utils/response.util';
import { Currency } from '@prisma/client';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto): Promise<DataResponse<Currency>> {
    return this.currencyService.create(createCurrencyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<DataResponse<Currency[]>> {
    return this.currencyService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('list')
  @HttpCode(200)
  list(@Body() listCurrencyDto: ListCurrencyDto): Promise<DataResponse<Currency[]>> {
    return this.currencyService.list(listCurrencyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DataResponse<Currency>> {
    return this.currencyService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<DataResponse<Currency>> {
    return this.currencyService.update(id, updateCurrencyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<DataResponse<Currency>> {
    return this.currencyService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('default-currency/:companyId')
  defaultCurrency(@Param('companyId', ParseIntPipe) companyId: number): Promise<DataResponse<Currency>> {
    return this.currencyService.defaultCurrency(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('default-currency')
  @HttpCode(200)
  postDefaultCurrency(@Body() defaultCurrencyDto: DefaultCurrencyDto): Promise<DataResponse<Currency>> {
    return this.currencyService.postDefaultCurrency(defaultCurrencyDto);
  }
}
