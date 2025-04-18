import { IsString, IsIn, IsNotEmpty, IsInt } from 'class-validator';
import { ConceptType } from '@prisma/client';

export class CreateConceptDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn([ConceptType.Expense, ConceptType.Ingress])
  type: ConceptType;

  @IsInt()
  company_id: number;
}