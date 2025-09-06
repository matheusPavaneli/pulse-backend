import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EventMetadata {
  @IsString({ message: 'Service must be a string' })
  @IsNotEmpty({ message: 'Service is required' })
  service: string;

  @IsString({ message: 'Severity must be a string' })
  @IsNotEmpty({ message: 'Severity is required' })
  severity: string;
}

export class CreateEventDto {
  @IsString({ message: 'Type must be a string' })
  @IsNotEmpty({ message: 'Type is required' })
  type: string;

  @IsString({ message: 'companyId must be a string' })
  @IsNotEmpty({ message: 'companyId is required' })
  companyId: string;

  @IsObject({ message: 'Payload must be an object' })
  @IsNotEmpty({ message: 'Payload is required' })
  payload: Record<string, unknown>;

  @IsObject({ message: 'Metadata must be an object' })
  @IsNotEmptyObject(
    { nullable: false },
    { message: 'Metadata cannot be empty' },
  )
  @ValidateNested()
  @Type(() => EventMetadata)
  metadata: EventMetadata;
}
