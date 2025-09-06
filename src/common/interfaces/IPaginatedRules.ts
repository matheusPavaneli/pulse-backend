import type { Rule } from 'src/modules/rule/rule.entity';

export default interface IPaginatedRules {
  rules: Rule[];
  total: number;
  page: number;
  limit: number;
}
