import { HttpStatus, Injectable } from '@nestjs/common';
import { Bank } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { 
  DataResponse, 
  responseData, 
  responseError,
} from 'src/common/utils/response.util';

@Injectable()
export class BankService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBankDto: CreateBankDto): Promise<DataResponse<Bank>> {
    try {
      const bank = await this.prisma.bank.create({data: createBankDto});  
      return responseData(bank, 'Banco creado correctamente.', HttpStatus.CREATED);    
    } catch (error) {
      throw responseError(error, 'No se pudo crear el banco.');  
    }
  }

  async findAll(): Promise<DataResponse<Bank[]>> {
    try {
      const banks = await this.prisma.bank.findMany();
      return responseData(banks, 'Listado de bancos.');
    } catch (error) {
      throw responseError(error, 'No se pudo obtener el listado de bancos.');      
    }
  }

  async findOne(id: number): Promise<DataResponse<Bank>> {
    try {
      const bank = await this.prisma.bank.findUniqueOrThrow({ where: { id } });
      return responseData(bank, `Detalles del banco ${id}.`);
    } catch (error) {
      throw responseError(error, `No se pudo obtener el banco ${id}.`, HttpStatus.NOT_FOUND);      
    }
  }

  async update(id: number, updateBankDto: UpdateBankDto): Promise<DataResponse<Bank>> {
    await this.findOne(id);
    try {
      const bank = await this.prisma.bank.update({
        where: { id },
        data: updateBankDto,
      });
      return responseData(bank, 'Banco actualizado correctamente.');
    } catch (error) {
      throw responseError(error, 'No se pudo actualizar el banco.');  
    }
  }

  async remove(id: number): Promise<DataResponse<Bank>> {
    await this.findOne(id);
    try {
      const bank = await this.prisma.bank.delete({ where: { id } });
      return responseData(bank, 'Banco eliminado correctamente.');
    } catch (error) {
      throw responseError(error, `No se pudo eliminar el banco ${id}.`);
    }
  }
}
