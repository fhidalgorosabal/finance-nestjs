import { Injectable, HttpStatus } from '@nestjs/common';
import { ConceptType, Prisma, Receipt } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { DataResponse, responseData, responseError } from 'src/common/utils/response.util';
import { ListReceiptsDto } from './dto/list-receipts.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';

@Injectable()
export class ReceiptService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReceiptDto: CreateReceiptDto): Promise<DataResponse<Receipt>> {
    const { amount, currencyId, accountId } = createReceiptDto;

    try {
      const actualAmount = await this.calculateActualAmount(currencyId, amount);

      const validAmount = await this.isAmountValid(accountId, createReceiptDto.conceptId, actualAmount);
      if (!validAmount) {
        throw new Error('El saldo de la cuenta no es suficiente');
      }

      const sameCurrency = await this.validAccountAndCurrency(accountId, currencyId);
      if (!sameCurrency) {
        throw new Error('Esta cuenta no es del tipo de moneda seleccionada');
      }

      const receipt = await this.prisma.receipt.create({
        data: {
          ...createReceiptDto,
          actualAmount,
        },
      });

      return responseData(receipt, 'Se ha creado el comprobante correctamente', HttpStatus.CREATED);
    } catch (error) {
      throw responseError(error, 'No se pudo crear el comprobante');
    }
  }
  
  async findAll(): Promise<DataResponse<Receipt[]>> {
    try {
      const receipts = await this.getReceipts();
      return responseData(receipts, 'Listado de comprobantes');
    } catch (error) {
      throw responseError(error, 'No se pudo obtener el listado');
    }
  }
  
  async list(listReceiptsDto: ListReceiptsDto): Promise<DataResponse<Receipt[]>> {
    try {
      const { type, companyId } = listReceiptsDto;
      const receipts = await this.getReceipts(type, companyId);
      return responseData(receipts, `Listado de comprobantes de ${type}`);
    } catch (error) {
      throw responseError(error, 'No se pudo obtener el listado de comprobantes');
    }
  }

  async findOne(id: number): Promise<DataResponse<Receipt>> {
    try {
      const receipt = await this.prisma.receipt.findUniqueOrThrow({ where: { id } });
      return responseData(receipt, `Detalles del comprobante ${id}`);
    } catch (error) {
      throw responseError(error, `No se pudo obtener el comprobante ${id}`, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateReceiptDto: UpdateReceiptDto): Promise<DataResponse<Receipt>> {
    await this.findOne(id);
  
    try {
      let actualAmount: number | undefined;
  
      if (updateReceiptDto.amount !== undefined && updateReceiptDto.currencyId !== undefined) {
        actualAmount = await this.calculateActualAmount(updateReceiptDto.currencyId, updateReceiptDto.amount);
      }
  
      if (
        updateReceiptDto.accountId !== undefined &&
        updateReceiptDto.conceptId !== undefined &&
        actualAmount !== undefined
      ) {
        const validAmount = await this.isAmountValid(updateReceiptDto.accountId, updateReceiptDto.conceptId, actualAmount);
        if (!validAmount) throw new Error('El saldo de la cuenta no es suficiente');
      }
  
      if (updateReceiptDto.accountId !== undefined && updateReceiptDto.currencyId !== undefined) {
        const sameCurrency = await this.validAccountAndCurrency(updateReceiptDto.accountId, updateReceiptDto.currencyId);
        if (!sameCurrency) throw new Error('Esta cuenta no es del tipo de moneda seleccionada');
      }
  
      const dataToUpdate: Prisma.ReceiptUpdateInput = { ...updateReceiptDto };
      if (actualAmount !== undefined) {
        dataToUpdate.actualAmount = actualAmount;
      }
  
      const receipt = await this.prisma.receipt.update({
        where: { id },
        data: dataToUpdate,
      });
  
      return responseData(receipt, 'Se ha actualizado el comprobante correctamente');
    } catch (error) {
      throw responseError(error, 'No se pudo actualizar el comprobante');
    }
  }
  

  async remove(id: number): Promise<DataResponse<Receipt>> {
    try {
      const receipt = await this.prisma.receipt.delete({ where: { id } });
      return responseData(receipt, 'Se ha eliminado el comprobante correctamente');
    } catch (error) {
      throw responseError(error, `No se pudo eliminar el comprobante ${id}`);
    }
  }
  
  private async getReceipts(type?: ConceptType, companyId?: number) {      
    const where: Prisma.ReceiptWhereInput = await this.getWhereFilter(type, companyId); 
    
    return this.prisma.receipt.findMany({
      where,
      select: {
        id: true,
        amount: true,
        date: true,
        actualAmount: true,
        concept: { select: { description: true, type: true } },
        currency: { select: { initials: true } },
        account: { select: { description: true } },
      },
    });
  }

  private async getWhereFilter(type?: ConceptType, companyId?: number): Promise<Prisma.ReceiptWhereInput> {
    const where: Prisma.ReceiptWhereInput = {};
    if (type) {
      where.concept = {
        is: { type },
      };
    }
  
    if (companyId) {
      where.companyId = companyId;
  
      const setting = await this.prisma.setting.findFirst({
        where: { companyId },
        select: { currentMonth: true },
      });
  
      const currentMonth = setting?.currentMonth;
  
      if (currentMonth) {
        const year = new Date().getFullYear();
        const startDate = new Date(`${year}-${currentMonth.padStart(2, '0')}-01`);
        const endDate = new Date(`${year}-${(parseInt(currentMonth) + 1).toString().padStart(2, '0')}-01`);
  
        where.date = {
          gte: startDate,
          lt: endDate,
        };
      }
    }
    return where;
  }

  private async calculateActualAmount(currencyId: number, amount: number): Promise<number> {
    const currency = await this.prisma.currency.findUnique({ where: { id: currencyId } });  
    const exchangeRate = currency?.exchangeRate?.toNumber?.() ?? 1;  
    return exchangeRate * amount;
  }
  

  private async isAmountValid(accountId: number, conceptId: number, actualAmount: number): Promise<boolean> {
    const concept = await this.prisma.concept.findUnique({ where: { id: conceptId } });
    if (concept?.type === 'Expense') {
      const ingress = await this.getTotalAmount(accountId, 'Ingress');
      const expense = await this.getTotalAmount(accountId, 'Expense');
      return actualAmount <= (ingress - expense);
    }
    return true;
  }

  private async getTotalAmount(accountId: number, type: ConceptType): Promise<number> {
    const result = await this.prisma.receipt.aggregate({
      _sum: { actualAmount: true },
      where: { accountId, concept: { type } },
    });
    return result._sum?.actualAmount?.toNumber?.() ?? 0;
  }

  private async validAccountAndCurrency(accountId: number, currencyId: number): Promise<boolean> {
    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
    return account?.currencyId === currencyId;
  }
}
