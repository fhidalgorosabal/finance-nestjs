import { PartialType } from '@nestjs/mapped-types';
import { CreateCurrencyDto } from './create-currency.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    active?: boolean;
}
