import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { EventModule } from './modules/event/event.module';
import { RuleModule } from './modules/rule/rule.module';

@Module({
  imports: [CommonModule, EventModule, RuleModule],
})
export class AppModule {}
