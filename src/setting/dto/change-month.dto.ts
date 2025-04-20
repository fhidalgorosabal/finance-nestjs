import { IsNotEmpty, IsString } from 'class-validator';
import { SettingDto } from './setting.dto';

export class ChangeMonthDto extends SettingDto {
  @IsString()
  @IsNotEmpty()
  currentMonth: string;
}
