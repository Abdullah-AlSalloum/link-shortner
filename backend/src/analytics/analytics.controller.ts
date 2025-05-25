import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post(':shortCode/record')
  async recordClick(
    @Param('shortCode') shortCode: string,
    @Body() createAnalyticsDto: CreateAnalyticsDto,
  ) {
    return this.analyticsService.recordClick(shortCode, createAnalyticsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserAnalytics(@Request() req) {
    return this.analyticsService.getAnalyticsByUserId(req.user.userId);
  }

  @Get('guest')
  async getGuestAnalytics(@Query('guestId') guestId: string) {
    return this.analyticsService.getAnalyticsByGuestId(guestId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('link/:linkId')
  async getLinkAnalytics(@Param('linkId') linkId: string) {
    return this.analyticsService.getLinkAnalytics(linkId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary/:linkId')
  async getAnalyticsSummary(@Param('linkId') linkId: string) {
    return this.analyticsService.getAnalyticsSummary(linkId);
  }
}
