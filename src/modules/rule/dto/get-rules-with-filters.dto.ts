import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetRulesWithFiltersDto {
  @IsNotEmpty({ message: 'companyId is required' })
  @IsUUID(4, { message: 'companyId must be a valid UUID' })
  companyId: string;

  @IsOptional()
  @IsString({ message: 'eventType must be a string' })
  eventType?: string;
}
