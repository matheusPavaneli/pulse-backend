import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { Alert } from './alert.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from '../rule/rule.entity';
import { Event } from '../event/event.entity';
import { BullModule } from '@nestjs/bullmq';
import { AlertProcessor } from './alert.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert, Rule, Event]),
    BullModule.registerQueue({ name: 'alerts' }),
  ],
  providers: [AlertService, AlertProcessor],
  exports: [AlertService],
})
export class AlertModule {}
