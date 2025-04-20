import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  swift: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  bankName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  cis: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  branchName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  email?: string;
}
