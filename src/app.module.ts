import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { EventModule } from './modules/event/event.module';

@Module({
  imports: [CommonModule, EventModule],
})
export class AppModule {}
