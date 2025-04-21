import { Type } from "class-transformer";
import { 
  IsInt, 
  IsNotEmpty, 
  IsString, 
  MaxLength,
} from "class-validator";

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  description: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  currencyId: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  companyId: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  bankId: number;
}
