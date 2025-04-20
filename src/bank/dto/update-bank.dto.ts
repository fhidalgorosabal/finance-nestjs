import { PartialType } from '@nestjs/mapped-types';
import { CreateBankDto } from './create-bank.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBankDto extends PartialType(CreateBankDto) {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  active?: boolean;
}
