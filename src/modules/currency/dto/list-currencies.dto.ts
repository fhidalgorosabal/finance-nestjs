import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ListCurrenciesDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  companyId: number;
}
