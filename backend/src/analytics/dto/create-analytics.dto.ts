import { IsString, IsOptional, IsIP } from 'class-validator';

export class CreateAnalyticsDto {
  @IsIP()
  ipAddress: string;

  @IsOptional()
  @IsString()
  referrer?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
