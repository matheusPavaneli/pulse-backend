import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class GetUserEventsDto {
  @IsUUID(4, { message: 'userId must be a valid UUID' })
  userId: string;

  @IsOptional()
  @IsNumber({}, { message: 'page must be a number' })
  page: number = 1;

  @IsOptional()
  @IsNumber({}, { message: 'limit must be a number' })
  limit: number = 10;
}
