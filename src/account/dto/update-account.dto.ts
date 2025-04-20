import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  active?: boolean;
}
