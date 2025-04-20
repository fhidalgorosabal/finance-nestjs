import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ListAccountsDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  companyId: number;
}
