import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { GetRulesDto } from './dto/get-rules.dto';
import type IPaginatedRules from 'src/common/interfaces/IPaginatedRules';
import { PaginationDto } from 'src/common/shared/PaginationDto';
import { GetRulesWithFiltersDto } from './dto/get-rules-with-filters.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { DeleteRuleDto } from './dto/delete-rule.dto';

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

  @HttpCode(HttpStatus.OK)
  @Post('search')
  async getRulesWithFilters(
    @Body() getRulesWithFiltersDto: GetRulesWithFiltersDto,
    @Query() { limit, page }: PaginationDto,
  ): Promise<IPaginatedRules> {
    return this.ruleService.getRulesWithFilters(
      getRulesWithFiltersDto.companyId,
      page,
      limit,
      getRulesWithFiltersDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  async updateRule(@Body() updateRuleDto: UpdateRuleDto): Promise<void> {
    const { companyId, ruleId, ...data } = updateRuleDto;
    await this.ruleService.updateRule(updateRuleDto.companyId, ruleId, data);
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteRule(
    @Body() { ruleId, companyId }: DeleteRuleDto,
  ): Promise<void> {
    await this.ruleService.deleteRule(companyId, ruleId);
  }
}
