import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { NodemailerAdapter } from './infrastructure/nodemailer.adapter';
import { ResendAdapter } from './infrastructure/resend.adapter';
import { EmailProcessor } from './email.processor';
import type INodeMailerConfig from 'src/common/interfaces/INodeMailerConfig';
import type IResendConfig from 'src/common/interfaces/IResendConfig';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'email' }),
    ...(process.env.NODE_ENV !== 'production'
      ? [
          MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const nodemailerConfig =
                configService.get<INodeMailerConfig>('nodemailerConfig');

              if (!nodemailerConfig) {
                throw new HttpException(
                  'Nodemailer configuration is missing',
                  HttpStatus.NOT_FOUND,
                );
              }

              return {
                transport: {
                  host: nodemailerConfig.host,
                  port: nodemailerConfig.port,
                  auth: {
                    user: nodemailerConfig.user,
                    pass: nodemailerConfig.pass,
                  },
                },
                defaults: {
                  from: nodemailerConfig.from,
                },
                template: {
                  adapter: new HandlebarsAdapter(),
                  dir: __dirname + '/templates',
                },
              };
            },
          }),
        ]
      : []),
  ],
  providers: [
    ...(process.env.NODE_ENV !== 'dev'
      ? [
          {
            provide: 'RESEND_CONFIG',
            useFactory: (configService: ConfigService) => {
              const resendConfig =
                configService.get<IResendConfig>('resendConfig');

              if (!resendConfig) {
                throw new HttpException(
                  'Resend configuration is missing',
                  HttpStatus.NOT_FOUND,
                );
              }

              return resendConfig;
            },
            inject: [ConfigService],
          },
        ]
      : []),
    {
      provide: 'EMAIL_PORT',
      useClass:
        process.env.NODE_ENV !== 'dev' ? ResendAdapter : NodemailerAdapter,
    },
    EmailProcessor,
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
