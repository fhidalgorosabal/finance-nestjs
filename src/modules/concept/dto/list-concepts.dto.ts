import { ConceptType } from "@prisma/client";
import { IsIn, IsInt, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class ListConceptsDto {
    @IsIn([ConceptType.Expense, ConceptType.Ingress])
    @IsNotEmpty()
    type: ConceptType;

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    companyId: number;
}
