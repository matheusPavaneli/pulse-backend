import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import type ISupabaseConfig from 'src/common/interfaces/ISupabaseConfig';
import type { User } from '../user/user.entity';
import { CreateSupabasePayloadDto } from './dto/create-supabase-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    @Inject('SUPABASE_CONFIG')
    private readonly supabaseConfig: ISupabaseConfig,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/webhooks/supabase')
  async supabaseWebhook(
    @Body() { user: { id } }: CreateSupabasePayloadDto,
  ): Promise<User | null> {
    return await this.userService.createUser(id);
  }
}
