import { IsUrl, IsOptional, IsString } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'Original URL must be a valid URL' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  guestId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
