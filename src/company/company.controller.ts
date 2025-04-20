import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
} from '@nestjs/common';
import { Company } from '@prisma/client';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { DataResponse } from 'src/common/utils/response.util';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  //@UseGuards(JwtAuthGuard) TODO: Test if this is needed
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto): Promise<DataResponse<Company>> {
    return this.companyService.create(createCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<DataResponse<Company[]>> {
    return this.companyService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<DataResponse<Company>> {
    return this.companyService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateCompanyDto: UpdateCompanyDto
  ): Promise<DataResponse<Company>> {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DataResponse<Company>> {
    return this.companyService.remove(+id);
  }
}
