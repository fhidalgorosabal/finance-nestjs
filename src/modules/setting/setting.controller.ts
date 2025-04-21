import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { Setting } from '@prisma/client';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { SettingDto } from './dto/setting.dto';
import { ChangeMonthDto } from './dto/change-month.dto';
import { DataResponse } from 'src/common/utils/response.util';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { SettingInfo } from './entities/setting.entity';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(200)
  getSetting(@Body() settingDto: SettingDto): Promise<DataResponse<SettingInfo>> {
    return this.settingService.getSetting(settingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createOrUpdate(@Body() createSettingDto: CreateSettingDto): Promise<DataResponse<Setting>> {
    return this.settingService.createOrUpdate(createSettingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-month')
  @HttpCode(200)
  changeMonth(@Body() changeMonthDto: ChangeMonthDto): Promise<DataResponse<Setting>> {
    return this.settingService.changeMonth(changeMonthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('close-year')
  @HttpCode(200)
  closeYear(@Body() settingDto: SettingDto): Promise<DataResponse<Setting>> {
    return this.settingService.closeYear(settingDto);
  }
}
