import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyIdDto } from './company-id.dto';

export class DashboardDto extends CompanyIdDto {
  @IsIn(['Expense', 'Ingress'])
  @IsNotEmpty()
  type: 'Expense' | 'Ingress';

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  month: number;
}
