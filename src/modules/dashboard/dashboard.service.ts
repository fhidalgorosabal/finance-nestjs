import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DataResponse, responseData, responseError } from 'src/common/utils/response.util';
import { DashboardDto } from './dto/dashboard.dto';
import { ConceptType } from '@prisma/client';
import { CompanyIdDto } from './dto/company-id.dto';
import { GroupedObject, MonthConcept, MonthlyTotals } from './entities/dashboard.entity';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthTotal(dashboardDto: DashboardDto): Promise<DataResponse<number>> {
    const { type, month, companyId } = dashboardDto;
    try {
      const total = await this.prisma.receipt.aggregate({
        _sum: { actualAmount: true },
        where: {
          companyId,
          date: {
            gte: new Date(new Date().getFullYear(), month - 1, 1),
            lt: new Date(new Date().getFullYear(), month, 1),
          },
          concept: { type },
        },
      });

      return responseData(total._sum.actualAmount || 0, `Total de ${type === ConceptType.Expense ? 'gastos' : 'ingresos'}`);
    } catch (error) {
      throw responseError(error, 'No se pudo obtener el total');
    }
  }

  async getMonthConcepts(dashboardDto: DashboardDto): Promise<DataResponse<MonthConcept[]>> {
    const { type, month, companyId } = dashboardDto;
    try {
      const result = await this.prisma.$queryRawUnsafe<MonthConcept[]>(`
        SELECT 
          c.id, 
          c.description as conceptDescription, 
          c.type,
          SUM(r.actual_amount) as totalAmount
        FROM concept c
        JOIN receipt r ON c.id = r.concept_id
        WHERE c.type = '${type}'
          AND r.company_id = ${companyId}
          AND EXTRACT(MONTH FROM r.date) = ${month}
        GROUP BY c.id, c.description, c.type
      `);

      return responseData(result, `Conceptos mensuales de ${type === 'Expense' ? 'gastos' : 'ingresos'}`);
    } catch (error) {
      throw responseError(error, 'No se lograron obtener los conceptos mensuales');
    }
  }
  
  async getIngressAndExpenseByMonth(
    companyIdDto: CompanyIdDto
  ): Promise<DataResponse<MonthlyTotals[]>> {
    try {
      const setting = await this.prisma.setting.findFirstOrThrow({
        where: { companyId: companyIdDto.companyId },
      });
  
      const months: number[] = Array.from({ length: Number(setting.currentMonth) }, (_, i) => i + 1);
      const result = await this.prisma.$queryRawUnsafe<{
        type: ConceptType;
        totalAmount: number;
        month: number;
      }[]>(`
        SELECT 
          CASE WHEN c.type = 'Ingress' THEN 'Ingress' ELSE 'Expense' END as type,
          SUM(r.actual_amount) as totalAmount,
          EXTRACT(MONTH FROM r.date) as month
        FROM concept c
        LEFT JOIN receipt r ON c.id = r.concept_id
        WHERE r.company_id = ${companyIdDto.companyId}
          AND EXTRACT(MONTH FROM r.date) IN (${months.join(',')})
        GROUP BY type, month
      `);
  
      const grouped: GroupedObject[] = result.reduce<GroupedObject[]>((acc, row) => {
        const index = acc.findIndex((g) => g.type === row.type);
        if (index === -1) {
          acc.push({
            type: row.type,
            values: { [row.month]: Number(row.totalAmount) },
          });
        } else {
          acc[index].values[row.month] = Number(row.totalAmount);
        }
        return acc;
      }, []);
  
      const formatted: MonthlyTotals[] = grouped.map((g) => ({
        type: g.type,
        values: months.map((m) => g.values[m] || 0),
      }));
  
      return responseData(formatted, 'Totales mensuales de ingresos y gastos');
    } catch (error) {
      throw responseError(error, 'No se lograron obtener los totales mensuales');
    }
  }
   
}
