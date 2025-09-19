import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AlertService {
  constructor(
    @InjectQueue('alerts')
    private readonly alertQueue: Queue,
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  createAlert = (alert: Partial<Alert>): void => {
    this.alertQueue.add('process-alert', alert, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
  };

  getAlerts = async (companyId: string): Promise<Alert[]> => {
    return await this.alertRepository.find({ where: { companyId } });
  };
}
