import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetUserEventsWithFiltersDto {
  @IsString({ message: 'companyId must be a string' })
  @IsNotEmpty({ message: 'companyId is required' })
  companyId: string;

  @IsString({ message: 'Type must be a string' })
  @IsOptional()
  type?: string;

  @IsString({ message: 'Service must be a string' })
  @IsOptional()
  service?: string;

  @IsString({ message: 'Severity must be a string' })
  @IsOptional()
  severity?: string;

  @IsString({ message: 'Reason must be a string' })
  @IsOptional()
  reason?: string;

  @IsString({ message: 'fromDate must be a string' })
  @IsOptional()
  fromDate?: Date;

  @IsString({ message: 'toDate must be a string' })
  @IsOptional()
  toDate?: Date;
}
