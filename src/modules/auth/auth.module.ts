import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config';
import type ISupabaseConfig from 'src/common/interfaces/ISupabaseConfig';

@Module({
  providers: [
    {
      provide: 'SUPABASE_CONFIG',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const supabaseConfig =
          configService.get<ISupabaseConfig>('supabaseConfig');

        if (!supabaseConfig) {
          throw new HttpException(
            'Supabase configuration is missing',
            HttpStatus.NOT_FOUND,
          );
        }

        return supabaseConfig;
      },
    },
  ],
  imports: [UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
