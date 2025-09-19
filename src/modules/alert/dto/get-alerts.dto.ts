import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetAlertsDto {
  @IsNotEmpty({ message: 'companyId is required' })
  @IsUUID(4, { message: 'companyId must be a valid UUID' })
  companyId: string;
}
