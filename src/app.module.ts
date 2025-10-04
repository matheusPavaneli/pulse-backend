import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { EventModule } from './modules/event/event.module';
import { RuleModule } from './modules/rule/rule.module';
import { ActionsEngineModule } from './modules/actions-engine/actions-engine.module';;
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CommonModule, EventModule, RuleModule, ActionsEngineModule, AuthModule],
})
export class AppModule {}
