import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SettingDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  companyId: number;
}