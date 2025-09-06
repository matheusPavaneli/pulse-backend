import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from './rule.entity';
import type { CreateRuleDto } from './dto/create-rule.dto';
import type IPaginatedRules from 'src/common/interfaces/IPaginatedRules';

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
}
