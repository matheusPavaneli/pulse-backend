import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import type IEmailPort from 'src/common/interfaces/IEmailPort';

@Injectable()
export class NodemailerAdapter implements IEmailPort {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    message: string,
  ): Promise<void> {
    return this.mailerService.sendMail({
      to,
      subject,
      template: templateName,
      context: { message, subject },
      text: message,
    });
  }
}
