import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetUserEventsWithFiltersDto {
  @IsString({ message: 'UserId must be a string' })
  @IsNotEmpty({ message: 'UserId is required' })
  userId: string;

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

  @IsNumber({}, { message: 'page must be a number' })
  @IsOptional()
  page?: number;

  @IsNumber({}, { message: 'limit must be a number' })
  @IsOptional()
  limit?: number;
}
