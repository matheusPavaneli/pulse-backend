import { BullModule } from '@nestjs/bullmq';
import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type IDatabaseConfig from 'src/common/interfaces/IDatabaseConfig';
import type IRedisConfig from 'src/common/interfaces/IRedisConfig';

import databaseConfig from 'src/config/databaseConfig';
import evolutionApiConfig from 'src/config/evolutionApiConfig';
import nodemailerConfig from 'src/config/nodemailerConfig';
import redisConfig from 'src/config/redisConfig';
import resendConfig from 'src/config/resendConfig';
import supabaseConfig from 'src/config/supabaseConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      load: [
        databaseConfig,
        redisConfig,
        evolutionApiConfig,
        resendConfig,
        nodemailerConfig,
        supabaseConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig =
          configService.get<IDatabaseConfig>('databaseConfig');

        if (!databaseConfig) {
          throw new HttpException(
            'Database configuration is missing',
            HttpStatus.NOT_FOUND,
          );
        }
        return {
          type: 'postgres',
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.database,
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV === 'dev',
          logging: process.env.NODE_ENV === 'dev',
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<IRedisConfig>('redisConfig');

        if (!redisConfig) {
          throw new HttpException(
            'Redis configuration is missing',
            HttpStatus.NOT_FOUND,
          );
        }

        return {
          connection: {
            host: redisConfig.host,
            port: redisConfig.port,
          },
        };
      },
    }),
  ],
})
export class CommonModule {}
