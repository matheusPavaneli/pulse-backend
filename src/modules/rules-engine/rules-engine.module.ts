import { Module } from '@nestjs/common';
import { RulesEngineService } from './rules-engine.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from '../rule/rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rule])],
  providers: [RulesEngineService],
  exports: [RulesEngineService],
})
export class RulesEngineModule {}
