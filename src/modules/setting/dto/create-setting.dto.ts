import { IsNotEmpty, IsString } from 'class-validator';
import { ChangeMonthDto } from './change-month.dto';

export class CreateSettingDto extends ChangeMonthDto {
  @IsString()
  @IsNotEmpty()
  currentYear: string;
}
