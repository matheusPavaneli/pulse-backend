import { Module } from '@nestjs/common';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rule])],
  controllers: [RuleController],
  providers: [RuleService],
})
export class RuleModule {}
