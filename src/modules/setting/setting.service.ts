import { HttpStatus, Injectable } from '@nestjs/common';
import { ConceptType, Setting } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { ChangeMonthDto } from './dto/change-month.dto';
import { DataResponse, responseData, responseError } from 'src/common/utils/response.util';
import { SettingInfo } from './entities/setting.entity';
import { SettingDto } from './dto/setting.dto';

@Injectable()
export class SettingService {
  constructor(private readonly prisma: PrismaService) {}

  async getSetting(settingDto: SettingDto): Promise<DataResponse<SettingInfo>> {
    try {
      const setting = await this.prisma.setting.findFirst({
        where: { companyId: settingDto.companyId },
        select: {
          currentMonth: true,
          currentYear: true,
          company: {
            select: {
              companyCode: true,
              companyName: true,
              type: true,
            },
          },
        },
      });
      
      if (!setting) {
        throw new Error('Los datos de esta compañía no están registrados.');
      }
      
      const settingInfo: SettingInfo = {
        currentMonth: setting.currentMonth,
        currentYear: setting.currentYear,
        companyCode: setting.company.companyCode,
        companyName: setting.company.companyName,
        type: ConceptType[setting.company.type],
      };      

      return responseData(settingInfo, 'Configuración del sistema');
    } catch (error) {
      throw responseError(error, 'No es posible obtener la configuración.');
    }
  }

  async createOrUpdate(createSettingDto: CreateSettingDto): Promise<DataResponse<Setting>> {
    try {
      const existing = await this.prisma.setting.findFirst({
        where: { companyId: createSettingDto.companyId },
      });
  
      const setting = existing
        ? await this.prisma.setting.update({
            where: { id: existing.id },
            data: {
              currentMonth: createSettingDto.currentMonth,
              currentYear: createSettingDto.currentYear,
            },
          })
        : await this.prisma.setting.create({
            data: {
              companyId: createSettingDto.companyId,
              currentMonth: createSettingDto.currentMonth,
              currentYear: createSettingDto.currentYear,
            },
          });
  
      return responseData(
        setting, 
        existing ? 'Configuración actualizada' : 'Configuración creada',
        existing ? HttpStatus.OK : HttpStatus.CREATED,
      );
    } catch (error) {
      throw responseError(error, 'No se pudo guardar la configuración');
    }
  }
  

  async changeMonth(changeMonthDto: ChangeMonthDto): Promise<DataResponse<Setting>> {
    try {
      const setting = await this.prisma.setting.updateMany({
        where: { companyId: changeMonthDto.companyId },
        data: { currentMonth: changeMonthDto.currentMonth },
      });

      return responseData(setting, 'Se ha realizado el cambio de mes correctamente');
    } catch (error) {
      throw responseError(error, 'No se pudo realizar el cambio de mes.');
    }
  }

  async closeYear(ettingDto: SettingDto): Promise<DataResponse<Setting>> {
    try {
      const setting = await this.prisma.setting.findFirst({ where: { companyId: ettingDto.companyId } });

      if (!setting) throw new Error('Configuración no encontrada');

      const newYear = Number(setting.currentYear) + 1;

      const updated = await this.prisma.setting.update({
        where: { id: setting.id },
        data: {
          currentYear: newYear.toString(),
          currentMonth: '01',
        },
      });

      return responseData(updated, 'Cierre de año completado con éxito.');
    } catch (error) {
      throw responseError(error, 'No se pudo realizar el cierre de año.');
    }
  }
}
