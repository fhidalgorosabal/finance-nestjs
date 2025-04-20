import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReceiptDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  conceptId: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  currencyId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  accountId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  companyId: number;
}
