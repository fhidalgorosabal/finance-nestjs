import { HttpStatus, Injectable } from '@nestjs/common';
import { Currency, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { ListCurrencyDto } from './dto/list-currency.dto';
import { DefaultCurrencyDto } from './dto/default-currency.dto';
import { 
  DataResponse, 
  responseData, 
  responseError,
} from 'src/common/utils/response.util';

@Injectable()
export class CurrencyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCurrencyDto): Promise<DataResponse<Currency>> {
    try {
      const currency = await this.prisma.currency.create({
        data: {
          initials: dto.initials,
          description: dto.description,
          exchangeRate: dto.exchangeRate,
          isDefault: dto.isDefault ?? false,
          active: true,
          company: { connect: { id: dto.companyId } },
        },
      });
      return responseData(currency, 'Se ha creado la moneda correctamente.', HttpStatus.CREATED);
    } catch (e) {
      throw responseError(e, 'No se pudo crear la moneda.');
    }
  }

  async findAll(): Promise<DataResponse<Currency[]>> {
    try {
      const currencies = await this.prisma.currency.findMany();
      return responseData(currencies, 'Listado de las monedas');
    } catch (e) {
      throw responseError(e, 'No se pudo obtener el listado de monedas.');
    }
  }

  async list(dto: ListCurrencyDto): Promise<DataResponse<Currency[]>> {
    try {
      const currencies = await this.prisma.currency.findMany({
        where: {
          companyId: dto.companyId,
        },
      });
      return responseData(currencies, 'Listado de las monedas');
    } catch (e) {
      throw responseError(e, 'No se pudo obtener el listado de monedas.');
    }
  }

  async findOne(id: number): Promise<DataResponse<Currency>> {
    try {
      const currency = await this.prisma.currency.findUniqueOrThrow({
        where: { id },
      });
      return responseData(currency, `Detalles de la moneda: ${id}.`);
    } catch (e) {
      throw responseError(e, `No se pudo obtener la moneda: ${id}.`, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, dto: UpdateCurrencyDto): Promise<DataResponse<Currency>> {
    await this.findOne(id);
    try {    
      const data: Prisma.CurrencyUpdateInput = this.buildCurrencyData(dto);  
      const updatedCurrency = await this.prisma.currency.update({
        where: { id },
        data,
      });  
      return responseData(updatedCurrency, 'Se ha actualizado la moneda correctamente.');
    } catch (e) {
      throw responseError(e, 'No se pudo actualizar la moneda.');
    }
  }

  async remove(id: number): Promise<DataResponse<Currency>> {
    await this.findOne(id);
    try {
      const currency = await this.prisma.currency.delete({ where: { id } });
      return responseData(currency, 'Se ha eliminado la moneda correctamente.');
    } catch (e) {
      throw responseError(e, `No se pudo eliminar la moneda: ${id}.`);
    }
  }

  async defaultCurrency(companyId: number): Promise<DataResponse<Currency>> {
    const msjError = 'No se encontró una moneda predeterminada para esta compañía.';
    try {
      const currency = await this.prisma.currency.findFirstOrThrow({
        where: {
          isDefault: true,
          companyId,
        },
      });         
      return responseData(currency, 'Moneda predeterminada.');
    } catch (e) {
      throw responseError(e, msjError, HttpStatus.NOT_FOUND);
    }
  }

  async postDefaultCurrency(defaultCurrencyDto: DefaultCurrencyDto): Promise<DataResponse<Currency>> {
    const { data: currency } = await this.findOne(defaultCurrencyDto.id);  
    try {
      await this.prisma.currency.updateMany({
        where: { companyId: (currency as Currency).companyId },
        data: { isDefault: false },
      });
  
      const updatedCurrency = await this.prisma.currency.update({
        where: { id: defaultCurrencyDto.id },
        data: { isDefault: true, exchangeRate: 1 },
      });
  
      return responseData(updatedCurrency, 'Moneda predeterminada actualizada correctamente.');
    } catch (e) {
      throw responseError(e, 'No se pudo actualizar la moneda predeterminada.');
    }
  }
  

  private buildCurrencyData(dto: UpdateCurrencyDto): Prisma.CurrencyUpdateInput {
    const { companyId, ...fields } = dto;
    return {
      ...fields,
      ...(companyId ? { company: { connect: { id: companyId } } } : {}),
    };
  }
  
  
}
