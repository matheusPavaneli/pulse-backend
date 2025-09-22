import { Module } from '@nestjs/common';
import { ActionsEngineService } from './actions-engine.service';
import { WhatsAppModule } from '../whatsapp/whats-app.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [WhatsAppModule, EmailModule],
  providers: [ActionsEngineService],
  exports: [ActionsEngineService],
})
export class ActionsEngineModule {}
