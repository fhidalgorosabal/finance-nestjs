import { HttpStatus, Injectable } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DataResponse, responseData, responseError } from 'src/common/utils/response.util';
import { ListAccountsDto } from './dto/list-accounts.dto';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAccountDto: CreateAccountDto): Promise<DataResponse<Account>> {
      try {
        const account = await this.prisma.account.create({
          data: {
            code: createAccountDto.code,
            description: createAccountDto.description,
            active: true,
            currency: { connect: { id: createAccountDto.currencyId } },
            company: { connect: { id: createAccountDto.companyId } },
            bank: { connect: { id: createAccountDto.bankId } },
          },
        });
        return responseData(account, 'Se ha creado la cuenta correctamente.', HttpStatus.CREATED);
      } catch (error) {
        throw responseError(error, 'No se pudo crear la cuenta.');
      }
    }

  async findAll(): Promise<DataResponse<Account[]>> {
    try {
      const accounts = await this.prisma.account.findMany();
      return responseData(accounts, 'Listado de cuentas.');
    } catch (error) {
      throw responseError(error, 'No se pudo obtener el listado de cuentas.');
    }
  }
  
  async list(listAccountsDto: ListAccountsDto): Promise<DataResponse<Account[]>> {
    try {
      const accounts = await this.prisma.account.findMany({
        where: {
          companyId: listAccountsDto.companyId,
        },
      });
      return responseData(accounts, 'Listado de las cuentas');
    } catch (error) {
      throw responseError(error, 'No se pudo obtener el listado de cuentas.');
    }
  }

  async findOne(id: number) {
    try {
      const account = await this.prisma.account.findUniqueOrThrow({ 
        where: { 
          id,
          active: true,
        } 
      });
      return responseData(account, `Detalles de la cuenta ${id}.`);
    } catch (error) {
      throw responseError(error, `No se pudo obtener la cuenta ${id}.`, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateAccountDto: UpdateAccountDto): Promise<DataResponse<Account>> {
    await this.findOne(id);
    try {      
      const { companyId, ...fields } = updateAccountDto;
      const data: Prisma.AccountUpdateInput = {
        ...fields,
        ...(companyId !== undefined && { company: { connect: { id: companyId } } }),
      };      
      const account = await this.prisma.account.update({
        where: { id },
        data,
      });
      return responseData(account, 'Se ha actualizado la cuenta correctamente.');
    } catch (error) {
      throw responseError(error, 'No se pudo actualizar la cuenta.');
    }
  }

  async remove(id: number): Promise<DataResponse<Account>> {
    await this.findOne(id);
    try {
      const account = await this.prisma.account.delete({ where: { id } });
      return responseData(account, 'Se ha eliminado la cuenta correctamente.');
    } catch (error) {
      throw responseError(error, `No se pudo eliminar la cuenta: ${id}.`);
    }
  }
}
