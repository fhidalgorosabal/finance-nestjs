import { ConceptType } from '@prisma/client';
import { IsString, IsIn, IsNotEmpty, IsInt, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConceptDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  description: string;

  @IsIn([ConceptType.Expense, ConceptType.Ingress])
  @IsNotEmpty()
  type: ConceptType;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  companyId: number;
}