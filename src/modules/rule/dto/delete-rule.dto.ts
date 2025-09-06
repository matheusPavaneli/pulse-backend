import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteRuleDto {
  @IsNotEmpty({ message: 'ruleId is required' })
  @IsUUID(4, { message: 'ruleId must be a valid UUID' })
  ruleId: string;

  @IsNotEmpty({ message: 'companyId is required' })
  @IsUUID(4, { message: 'companyId must be a valid UUID' })
  companyId: string;
}
