import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

@Injectable()
export class WhatsAppService {
  constructor(@InjectQueue('whatsapp') private readonly whatsappQueue: Queue) {}

  enqueue = (phoneNumber: string, message: string): void => {
    this.whatsappQueue.add(
      'process-whatsapp',
      { phoneNumber, message },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    );
  };
}
