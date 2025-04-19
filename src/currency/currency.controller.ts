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

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.create(createCurrencyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('list')
  @HttpCode(200)
  list(@Body() listCurrencyDto: ListCurrencyDto) {
    return this.currencyService.list(listCurrencyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.currencyService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    return this.currencyService.update(id, updateCurrencyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.currencyService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('default-currency/:companyId')
  defaultCurrency(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.currencyService.defaultCurrency(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('default-currency')
  @HttpCode(200)
  postDefaultCurrency(@Body() defaultCurrencyDto: DefaultCurrencyDto) {
    return this.currencyService.postDefaultCurrency(defaultCurrencyDto);
  }
}
