import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DataResponse, responseData, responseError } from 'src/common/utils/response.util';
import { Company } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<DataResponse<Company>> {
    try {
      const company = await this.prisma.company.create({ data: createCompanyDto });
      return responseData(company, 'Empresa creada correctamente.', HttpStatus.CREATED);
    } catch (error) {
      throw responseError(error, 'No se pudo crear la empresa.');
    }
  }

  async findAll(): Promise<DataResponse<Company[]>> {
    try {
      const companies = await this.prisma.company.findMany();
      return responseData(companies, 'Listado de empresas.');
    } catch (error) {
      throw responseError(error, 'No se pudo obtener el listado.');
    }
  }

  async findOne(id: number): Promise<DataResponse<Company>> {
    try {
      const company = await this.prisma.company.findUniqueOrThrow({ where: { id } });
      return responseData(company, `Detalles de la empresa ${id}.`);
    } catch (error) {
      throw responseError(error, `No se pudo obtener la empresa ${id}.`, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<DataResponse<Company>> {
    await this.findOne(id);
    try {
      const company = await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto,
      });
      return responseData(company, 'Empresa actualizada correctamente.');
    } catch (error) {
      throw responseError(error, 'No se pudo actualizar la empresa.');
    }
  }

  async remove(id: number): Promise<DataResponse<Company>> {
    await this.findOne(id);
    try {
      const company = await this.prisma.company.delete({ where: { id } });
      return responseData(company, 'Empresa eliminada correctamente.');
    } catch (error) {
      throw responseError(error, `No se pudo eliminar la empresa ${id}.`);
    }
  }
}
