import { ConceptType } from "@prisma/client";
import { IsIn, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class ListConceptsDto {
    @IsIn([ConceptType.Expense, ConceptType.Ingress])
    @Type(() => Number)
    type: ConceptType;

    @IsInt()
    @Type(() => Number)
    companyId: number;
}
