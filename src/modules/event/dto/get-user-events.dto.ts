import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class GetUserEventsDto {
  @IsUUID(4, { message: 'companyId must be a valid UUID' })
  companyId: string;
}
