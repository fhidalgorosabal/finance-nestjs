import { Injectable, HttpStatus } from '@nestjs/common';
import { Prisma, Receipt } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { DataResponse, responseData, responseError } from 'src/common/utils/response.util';
import { ListReceiptsDto } from './dto/list-receipts.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { ReceiptInfo } from './entities/receipt.entity';
import { ReceiptUtil } from './utils/receipt.util';

@Injectable()
export class ReceiptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly receiptUtil: ReceiptUtil,
  ) {}

  async create(createReceiptDto: CreateReceiptDto): Promise<DataResponse<Receipt>> {
    await this.receiptUtil.ensureDateInCurrentMonth(createReceiptDto.date, createReceiptDto.companyId);
    const { amount, currencyId, accountId } = createReceiptDto;

    try {
      const actualAmount = await this.receiptUtil.calculateActualAmount(currencyId, amount);

      const validAmount = await this.receiptUtil.isAmountValid(accountId, createReceiptDto.conceptId, actualAmount);
      if (!validAmount) {
        throw new Error('El saldo de la cuenta no es suficiente');
      }

      const sameCurrency = await this.receiptUtil.validAccountAndCurrency(accountId, currencyId);
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
  
  async findAll(): Promise<DataResponse<ReceiptInfo[]>> {
    try {
      const receipts = await this.receiptUtil.getReceipts();
      return responseData(receipts, 'Listado de comprobantes');
    } catch (error) {
      throw responseError(error, 'No se pudo obtener el listado');
    }
  }
  
  async list(listReceiptsDto: ListReceiptsDto): Promise<DataResponse<ReceiptInfo[]>> {
    try {
      const { type, companyId } = listReceiptsDto;
      const receipts = await this.receiptUtil.getReceipts(type, companyId);
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
  
    if (updateReceiptDto.date) {
      const { companyId } = await this.prisma.receipt.findUniqueOrThrow({
        where: { id }
      });
      await this.receiptUtil.ensureDateInCurrentMonth(updateReceiptDto.date, companyId);
    }

    await this.findOne(id);
  
    try {
      let actualAmount: number | undefined;
  
      if (updateReceiptDto.amount !== undefined && updateReceiptDto.currencyId !== undefined) {
        actualAmount = await this.receiptUtil.calculateActualAmount(updateReceiptDto.currencyId, updateReceiptDto.amount);
      }
  
      if (
        updateReceiptDto.accountId !== undefined &&
        updateReceiptDto.conceptId !== undefined &&
        actualAmount !== undefined
      ) {
        const validAmount = await this.receiptUtil.isAmountValid(updateReceiptDto.accountId, updateReceiptDto.conceptId, actualAmount);
        if (!validAmount) throw new Error('El saldo de la cuenta no es suficiente');
      }
  
      if (updateReceiptDto.accountId !== undefined && updateReceiptDto.currencyId !== undefined) {
        const sameCurrency = await this.receiptUtil.validAccountAndCurrency(updateReceiptDto.accountId, updateReceiptDto.currencyId);
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
}
