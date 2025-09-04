import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type IDatabaseConfig from 'src/common/interfaces/IDatabaseConfig';

import databaseConfig from 'src/config/databaseConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      load: [databaseConfig],
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

        console.log(databaseConfig);
        console.log(process.env.NODE_ENV);

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
  ],
})
export class CommonModule {}
