import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type DeleteResult } from 'typeorm';
import { isEqual } from 'lodash';

import { Rule } from './rule.entity';
import type { CreateRuleDto } from './dto/create-rule.dto';
import type IPaginatedRules from 'src/common/interfaces/IPaginatedRules';
import type { GetRulesWithFiltersDto } from './dto/get-rules-with-filters.dto';
import type { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
  ) {}

  createRule = async (
    companyId: string,
    createRuleDto: CreateRuleDto,
  ): Promise<Rule> => {
    const rule: Rule = this.ruleRepository.create({
      ...createRuleDto,
      companyId,
    });
    return this.ruleRepository.save(rule);
  };

  getRules = async (
    companyId: string,
    page: number,
    limit: number,
  ): Promise<IPaginatedRules> => {
    const [data, total] = await this.ruleRepository
      .createQueryBuilder('rule')
      .where('rule.companyId = :companyId', { companyId })
      .orderBy('rule.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { rules: data, total, page, limit };
  };

  getRulesWithFilters = async (
    companyId: string,
    page: number,
    limit: number,
    filters: GetRulesWithFiltersDto,
  ): Promise<IPaginatedRules> => {
    const qb = this.ruleRepository
      .createQueryBuilder('rule')
      .where('rule.companyId = :companyId', { companyId });

    if (filters.eventType) {
      qb.andWhere('rule.eventType = :eventType', {
        eventType: filters.eventType,
      });
    }

    qb.orderBy('rule.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { rules: data, total, page, limit };
  };

  updateRule = async (
    companyId: string,
    ruleId: string,
    updateRuleDto: Partial<UpdateRuleDto>,
  ): Promise<Rule> => {
    const rule = await this.getRuleByIdOrThrow(companyId, ruleId);
    const { updatedFields, hasChanges } = await this.buildUpdatedFields(
      updateRuleDto,
      rule,
    );

    if (!hasChanges)
      throw new HttpException('No changes', HttpStatus.NOT_MODIFIED);

    Object.assign(rule, updatedFields);
    return this.ruleRepository.save(rule);
  };

  deleteRule = async (
    companyId: string,
    ruleId: string,
  ): Promise<Rule> => {
    const rule = await this.getRuleByIdOrThrow(companyId, ruleId);
    return await this.ruleRepository.remove(rule);
  };

  private buildUpdatedFields = async (
    data: Partial<UpdateRuleDto>,
    currentValues: Record<string, any>,
  ): Promise<{ updatedFields: Partial<Rule>; hasChanges: boolean }> => {
    const updatedFields: Partial<Rule> = {};
    let hasChanges = false;

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue;

      const currentValue = currentValues[key];

      let isChanged = false;

      if (typeof value === 'object' && typeof currentValue === 'object') {
        isChanged = !isEqual(value, currentValue);
      } else if (
        typeof value === 'string' &&
        typeof currentValue === 'string'
      ) {
        isChanged = value.trim() !== currentValue.trim();
      } else {
        isChanged = value !== currentValue;
      }

      if (isChanged) {
        hasChanges = true;
        updatedFields[key] = value;
      }
    }

    return { updatedFields, hasChanges };
  };

  private getRuleByIdOrThrow = async (
    companyId: string,
    ruleId: string,
  ): Promise<Rule> => {
    const rule = await this.ruleRepository.findOneBy({
      id: ruleId,
      companyId,
    });

    if (!rule)
      throw new HttpException("Rule doesn't exist", HttpStatus.NOT_FOUND);

    return rule;
  };
}
