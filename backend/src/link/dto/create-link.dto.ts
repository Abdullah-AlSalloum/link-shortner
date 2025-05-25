import { IsUrl, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateLinkDto {
  @IsUrl({}, { message: 'Original URL must be a valid URL' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  customShortCode?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
