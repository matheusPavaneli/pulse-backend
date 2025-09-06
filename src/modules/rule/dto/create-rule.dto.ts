import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class CreateRuleDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'eventType is required' })
  @IsString({ message: 'eventType must be a string' })
  eventType: string;

  @IsNotEmpty({ message: 'companyId is required' })
  @IsUUID(4, { message: 'companyId must be a valid UUID' })
  companyId: string;

  @IsNotEmpty({ message: 'conditions is required' })
  @IsObject({ message: 'conditions must be an object' })
  conditions: Record<string, unknown>;

  @IsNotEmpty({ message: 'actions is required' })
  @IsObject({ message: 'actions must be an object' })
  actions: Record<string, unknown>;
}
