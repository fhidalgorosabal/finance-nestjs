import { ConceptType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class ListReceiptsDto {
  @IsNotEmpty()
  @IsEnum(ConceptType)
  type?: ConceptType;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  companyId?: number;
}