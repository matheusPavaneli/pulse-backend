import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import path from 'path';
import { Resend } from 'resend';
import Handlebars from 'handlebars';
import type IEmailPort from 'src/common/interfaces/IEmailPort';
import type IResendConfig from 'src/common/interfaces/IResendConfig';

@Injectable()
export class ResendAdapter implements IEmailPort {
  private resend: Resend;
  constructor(
    @Inject('RESEND_CONFIG') private readonly resendConfig: IResendConfig,
  ) {
    this.resend = new Resend(this.resendConfig.resendApiKey);
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    message: string,
  ): Promise<void> {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.hbs`,
    );
    const templateSource = readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateSource);
    const html = template({ message, subject });

    await this.resend.emails.send({
      from:
        this.resendConfig.resendFromEmail ||
        "'No Reply' <contato@pulse.com.br>",
      to: to,
      subject: subject,
      html,
    });
  }
}
