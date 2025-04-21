import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsBoolean, 
  IsInt, 
  IsOptional, 
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  initials: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  exchangeRate: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  companyId: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isDefault?: boolean;
}
