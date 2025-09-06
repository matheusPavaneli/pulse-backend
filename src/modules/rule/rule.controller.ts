import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { GetRulesDto } from './dto/get-rules.dto';
import type IPaginatedRules from 'src/common/interfaces/IPaginatedRules';
import { PaginationDto } from 'src/common/shared/PaginationDto';

@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createRule(@Body() createRuleDto: CreateRuleDto): Promise<void> {
    await this.ruleService.createRule(createRuleDto.companyId, createRuleDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getRules(
    @Body() getRulesDto: GetRulesDto,
    @Query() { limit, page }: PaginationDto,
  ): Promise<IPaginatedRules> {
    return this.ruleService.getRules(getRulesDto.companyId, page, limit);
  }
}
