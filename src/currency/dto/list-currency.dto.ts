import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ListCurrencyDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  companyId: number;
}
