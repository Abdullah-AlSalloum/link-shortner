import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Link } from '../entities/link.entity';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(@Body() createUrlDto: CreateUrlDto): Promise<Link> {
    return this.urlService.shortenUrl(
      createUrlDto.originalUrl,
      createUrlDto.guestId,
      createUrlDto.userId
    );
  }

  @Get(':shortCode')
  async getOriginalUrl(@Param('shortCode') shortCode: string): Promise<{ originalUrl: string }> {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);
    return { originalUrl };
  }

  @Get('guest/links')
  async getLinksByGuestId(@Query('guestId') guestId: string): Promise<Link[]> {
    return this.urlService.getLinksByGuestId(guestId);
  }

  @Get('user/links')
  async getLinksByUserId(@Query('userId') userId: string): Promise<Link[]> {
    return this.urlService.getLinksByUserId(userId);
  }
}
