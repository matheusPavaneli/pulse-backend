import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';

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
  @IsArray({ message: 'actions must be an array' })
  actions: Record<string, unknown>[];
}
