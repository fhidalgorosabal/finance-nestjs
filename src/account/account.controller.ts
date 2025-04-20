import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  HttpCode, 
  ParseIntPipe,
} from '@nestjs/common';
import { Account } from '@prisma/client';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ListAccountsDto } from './dto/list-accounts.dto';
import { DataResponse } from 'src/common/utils/response.util';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Promise<DataResponse<Account>> {
    return this.accountService.create(createAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<DataResponse<Account[]>> {
    return this.accountService.findAll();
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('list')
  @HttpCode(200)
  list(@Body() listAccountsDto: ListAccountsDto): Promise<DataResponse<Account[]>> {    
    return this.accountService.list(listAccountsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DataResponse<Account>> {
    return this.accountService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateAccountDto: UpdateAccountDto
  ): Promise<DataResponse<Account>> {
    return this.accountService.update(id, updateAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<DataResponse<Account>> {
    return this.accountService.remove(id);
  }
}
