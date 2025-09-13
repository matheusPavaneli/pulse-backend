import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './alert.entity';
import { Repository } from 'typeorm';

@Processor('alerts')
export class AlertProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {
    super();
  }

  async process({ data }: Job<any, any, string>): Promise<Alert> {
    return await this.alertRepository.save(data);
  }
}
