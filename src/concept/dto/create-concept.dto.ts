import { ConceptType } from '@prisma/client';
import { IsString, IsIn, IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConceptDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn([ConceptType.Expense, ConceptType.Ingress])
  type: ConceptType;

  @IsInt()
  @Type(() => Number)
  companyId: number;
}