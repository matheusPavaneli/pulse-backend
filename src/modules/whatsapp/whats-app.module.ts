import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { WhatsAppService } from './whats-app.service';
import { ConfigService } from '@nestjs/config';
import type IEvolutionApiConfig from 'src/common/interfaces/IEvolutionApiConfig';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { WhatsAppProcessor } from './whats-app.processor';

@Module({
  imports: [HttpModule, BullModule.registerQueue({ name: 'whatsapp' })],
  providers: [
    {
      provide: 'EVOLUTION_CONFIG',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const evolutionApiConfig =
          configService.get<IEvolutionApiConfig>('evolutionApiConfig');

        if (!evolutionApiConfig) {
          throw new HttpException(
            'Evolution API configuration is missing',
            HttpStatus.NOT_FOUND,
          );
        }

        return evolutionApiConfig;
      },
    },
    WhatsAppService,
    WhatsAppProcessor,
  ],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
