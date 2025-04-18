import { ConceptType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class ListConceptsDto {
    @IsNotEmpty()
    @IsEnum(['Expense', 'Ingress'])
    type: ConceptType;

    @IsInt()
    @Type(() => Number)
    companyId: number;
}
