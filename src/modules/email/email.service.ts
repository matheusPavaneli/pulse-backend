import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {
    this.emailQueue.obliterate({ force: true });    
  }

  async enqueue(
    to: string,
    subject: string,
    templateName: string,
    message: string,
  ): Promise<void> {
    this.emailQueue.add(
      'process-email',
      { to, subject, templateName, message },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    );
  }
}
