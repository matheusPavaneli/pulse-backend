import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { EvolutionService } from './evolution.service';
import { ConfigService } from '@nestjs/config';
import type IEvolutionApiConfig from 'src/common/interfaces/IEvolutionApiConfig';

@Module({
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
    EvolutionService,
  ],
})
export class EvolutionModule {}
