import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  initials: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  exchangeRate: number;

  @IsInt()
  @Type(() => Number)
  companyId: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isDefault?: boolean;
}
