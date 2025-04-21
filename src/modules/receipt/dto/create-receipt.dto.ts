import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { parseToDate } from 'src/common/utils/format-date.util';

export class CreateReceiptDto {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => parseToDate(value), { toClassOnly: true })
  date: Date;

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
