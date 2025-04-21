import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class DefaultCurrencyDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}