import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateRuleDto {
  @IsNotEmpty({ message: 'companyId is required' })
  @IsString({ message: 'companyId must be a string' })
  companyId: string;

  @IsNotEmpty({ message: 'ruleId is required' })
  @IsString({ message: 'ruleId must be a string' })
  ruleId: string;

  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsOptional()
  @IsObject({ message: 'conditions must be an object' })
  conditions: Record<string, unknown>;

  @IsOptional()
  @IsArray({ message: 'actions must be an array' })
  actions: Record<string, unknown>[];
}
