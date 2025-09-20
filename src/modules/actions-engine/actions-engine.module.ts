import { Module } from '@nestjs/common';
import { ActionsEngineService } from './actions-engine.service';
import { WhatsAppModule } from '../whatsapp/whats-app.module';

@Module({
  imports: [WhatsAppModule],
  providers: [ActionsEngineService],
  exports: [ActionsEngineService],
})
export class ActionsEngineModule {}
