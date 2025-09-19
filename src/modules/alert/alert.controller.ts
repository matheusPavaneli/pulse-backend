import { Body, Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AlertService } from './alert.service';
import { Alert } from './alert.entity';
import { GetAlertsDto } from './dto/get-alerts.dto';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAlerts(@Body() { companyId }: GetAlertsDto): Promise<Alert[]> {
    return this.alertService.getAlerts(companyId);
  }
}
