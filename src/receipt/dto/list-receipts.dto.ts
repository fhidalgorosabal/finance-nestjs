import { ConceptType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class ListReceiptsDto {
  @IsNotEmpty()
  @IsEnum(ConceptType)
  type?: ConceptType;

  @IsNotEmpty()
  @IsInt()
  companyId?: number;
}