import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import type IEmailPort from 'src/common/interfaces/IEmailPort';

@Processor('email', {
  lockDuration: 120000,
  lockRenewTime: 30000,
  stalledInterval: 120000,
})
export class EmailProcessor extends WorkerHost {
  constructor(@Inject('EMAIL_PORT') private readonly emailPort: IEmailPort) {
    super();
  }

  async process({
    data: { to, subject, templateName, message },
  }: {
    data: {
      to: string;
      subject: string;
      templateName: string;
      message: string;
    };
  }) {
    try {
      await this.emailPort.sendMail(to, subject, templateName, message);
    } catch (error) {
      console.error(
        'Erro ao enviar email:',
        error?.response?.data || error.message,
      );
      throw error;
    }
  }
}
