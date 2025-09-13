import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './event.entity';
import { RulesEngineModule } from '../rules-engine/rules-engine.module';
import { BullModule } from '@nestjs/bullmq';
import { EventProcessor } from './event.processor';
import { AlertModule } from '../alert/alert.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    BullModule.registerQueue({ name: 'events' }),
    RulesEngineModule,
    AlertModule,
  ],
  providers: [EventService, EventProcessor],
  controllers: [EventController],
})
export class EventModule {}
