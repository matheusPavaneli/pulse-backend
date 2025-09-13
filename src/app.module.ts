import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { EventModule } from './modules/event/event.module';
import { RuleModule } from './modules/rule/rule.module';
import { AlertService } from './modules/alert/alert.service';
import { AlertModule } from './modules/alert/alert.module';

@Module({
  imports: [CommonModule, EventModule, RuleModule],
})
export class AppModule {}
