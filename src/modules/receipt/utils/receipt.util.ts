import { HttpStatus, Injectable } from "@nestjs/common";
import { ConceptType, Prisma } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { responseError } from "src/common/utils/response.util";
import { ReceiptInfo } from "../entities/receipt.entity";

@Injectable()
export class ReceiptUtil {
  constructor(private readonly prisma: PrismaService) {}

  async getReceipts(
    type?: ConceptType,
    companyId?: number
  ): Promise<ReceiptInfo[]> {
    const where: Prisma.ReceiptWhereInput = await this.getWhereFilter(type, companyId);
  
    const receipts = await this.prisma.receipt.findMany({
      where,
      select: {
        id: true,
        amount: true,
        date: true,
        actualAmount: true,
        concept: { select: { description: true , type: true } },
        currency: { select: { initials: true } },
        account: { select: { description: true } },
      },
    });
  
    return receipts.map(r => ({
      id: r.id,
      amount: r.amount.toNumber(),
      date: r.date,
      actualAmount: r.actualAmount.toNumber(),
      concept: r.concept.description,
      type: r.concept.type,
      currency: r.currency.initials,
      account: r.account.description,
    }));
  }

  async getWhereFilter(
    type?: ConceptType,
    companyId?: number
  ): Promise<Prisma.ReceiptWhereInput> {
    const where: Prisma.ReceiptWhereInput = {};
  
    if (type) {
      where.concept = { is: { type } };
    }
  
    if (companyId) {
      where.companyId = companyId;
  
      const dateFilter = await this.buildCurrentMonthFilter(companyId);
      if (dateFilter) {
        where.date = dateFilter;
      }
    }
  
    return where;
  }  

  async ensureDateInCurrentMonth(
    dateValue: string | Date,
    companyId: number
  ): Promise<void> {
    const dateFilter = await this.buildCurrentMonthFilter(companyId);
    if (!dateFilter) return;

    const date = dateValue instanceof Date
      ? dateValue
      : new Date(dateValue);

    if (date < (dateFilter.gte as Date) || date >= (dateFilter.lt as Date)) {
      throw responseError(
        new Error('La fecha debe pertenecer al mes actual'),
        'Fecha fuera del mes actual',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async buildCurrentMonthFilter(
    companyId: number
  ): Promise<Prisma.DateTimeFilter | undefined> {
    const setting = await this.prisma.setting.findFirst({
      where: { companyId },
      select: { currentMonth: true },
    });
    if (!setting?.currentMonth) return undefined;

    const year = new Date().getFullYear();
    const m = setting.currentMonth.padStart(2, '0');
    const next = (parseInt(setting.currentMonth, 10) + 1)
      .toString()
      .padStart(2, '0');

    return {
      gte: new Date(`${year}-${m}-01`),
      lt:  new Date(`${year}-${next}-01`)
    };
  }

  async calculateActualAmount(currencyId: number, amount: number): Promise<number> {
    const currency = await this.prisma.currency.findUnique({ where: { id: currencyId } });  
    const exchangeRate = currency?.exchangeRate?.toNumber?.() ?? 1;  
    return exchangeRate * amount;
  }

  async isAmountValid(accountId: number, conceptId: number, actualAmount: number): Promise<boolean> {
    const concept = await this.prisma.concept.findUnique({ where: { id: conceptId } });
    if (concept?.type === 'Expense') {
      const ingress = await this.getTotalAmount(accountId, ConceptType.Ingress);
      const expense = await this.getTotalAmount(accountId, ConceptType.Expense);
      return actualAmount <= (ingress - expense);
    }
    return true;
  }

  async getTotalAmount(accountId: number, type: ConceptType): Promise<number> {
    const result = await this.prisma.receipt.aggregate({
      _sum: { actualAmount: true },
      where: { accountId, concept: { type } },
    });
    return result._sum?.actualAmount?.toNumber?.() ?? 0;
  }

  async validAccountAndCurrency(accountId: number, currencyId: number): Promise<boolean> {
    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
    return account?.currencyId === currencyId;
  }
}