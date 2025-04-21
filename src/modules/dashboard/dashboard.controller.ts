import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { DataResponse } from 'src/common/utils/response.util';
import { DashboardDto } from './dto/dashboard.dto';
import { CompanyIdDto } from './dto/company-id.dto';
import { MonthConcept, MonthlyTotals } from './entities/dashboard.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('get-month-total')
  @HttpCode(200)
  getMonthTotal(@Body() dashboardDto: DashboardDto): Promise<DataResponse<number>> {
    return this.dashboardService.getMonthTotal(dashboardDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-month-concepts')
  @HttpCode(200)
  getMonthConcepts(
    @Body() dashboardDto: DashboardDto
  ): Promise<DataResponse<MonthConcept[]>> {
    return this.dashboardService.getMonthConcepts(dashboardDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-ingress-expenses-month')
  @HttpCode(200)
  getIngressAndExpenseByMonth(
    @Body() companyIdDto: CompanyIdDto 
  ): Promise<DataResponse<MonthlyTotals[]>> {
    return this.dashboardService.getIngressAndExpenseByMonth(companyIdDto);
  }
}
