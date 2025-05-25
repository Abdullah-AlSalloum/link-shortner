import { IsOptional, IsString, IsUrl, IsDateString } from 'class-validator';

export class UpdateLinkDto {
  @IsOptional()
  @IsUrl({}, { message: 'Original URL must be a valid URL' })
  originalUrl?: string;

  @IsOptional()
  @IsString()
  customShortCode?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
