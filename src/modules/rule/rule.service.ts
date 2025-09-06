import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from './rule.entity';
import type { CreateRuleDto } from './dto/create-rule.dto';
import type IPaginatedRules from 'src/common/interfaces/IPaginatedRules';
import type { GetRulesWithFiltersDto } from './dto/get-rules-with-filters.dto';

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
}
