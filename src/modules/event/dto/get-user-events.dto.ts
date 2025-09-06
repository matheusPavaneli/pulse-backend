import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetUserEventsDto {
  @IsNotEmpty({ message: 'companyId is required' })
  @IsUUID(4, { message: 'companyId must be a valid UUID' })
  companyId: string;
}
