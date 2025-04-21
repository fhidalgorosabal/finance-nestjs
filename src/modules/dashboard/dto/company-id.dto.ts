import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CompanyIdDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  companyId: number;
}
