import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

class SupabaseMetadataDto {
  @IsUUID('all', { message: 'uuid must be a valid UUID' })
  uuid: string;

  @IsString({ message: 'time must be a string' })
  time: string;

  @IsString({ message: 'name must be a string' })
  name: string;

  @IsString({ message: 'ip_address must be a string' })
  ip_address: string;
}

class SupabaseAppMetadataDto {
  @IsString({ message: 'provider must be a string' })
  provider: string;

  @IsArray({ message: 'providers must be an array' })
  @IsString({ each: true })
  providers: string[];
}

class SupabaseUserDto {
  @IsUUID('all', { message: 'id must be a valid UUID' })
  id: string;

  @IsString({ message: 'aud must be a string' })
  aud: string;

  @IsString({ message: 'role must be a string' })
  role: string;

  @IsEmail({}, { message: 'email must be a valid email' })
  email: string;

  @IsString({ message: 'phone must be a string' })
  phone: string;

  @IsDefined({ message: 'app_metadata is required' })
  @ValidateNested()
  @Type(() => SupabaseAppMetadataDto)
  app_metadata: SupabaseAppMetadataDto;

  @IsObject({ message: 'user_metadata must be an object' })
  user_metadata: Record<string, any>;

  @IsArray({ message: 'identities must be an array' })
  identities: Array<Record<string, any>>;

  @IsOptional()
  @IsString({ message: 'created_at must be a string' })
  created_at: string | null;

  @IsOptional()
  @IsString({ message: 'updated_at must be a string' })
  updated_at: string | null;

  @IsBoolean({ message: 'is_anonymous must be a boolean' })
  is_anonymous: boolean;
}

export class CreateSupabasePayloadDto {
  @IsDefined({ message: 'metadata is required' })
  @ValidateNested()
  @Type(() => SupabaseMetadataDto)
  metadata: SupabaseMetadataDto;

  @IsDefined({ message: 'user is required' })
  @ValidateNested()
  @Type(() => SupabaseUserDto)
  user: SupabaseUserDto;
}
