import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from '../entities/analytics.entity';
import { Link } from '../entities/link.entity';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private analyticsRepository: Repository<Analytics>,
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
  ) {}

  async recordClick(shortCode: string, createAnalyticsDto: CreateAnalyticsDto): Promise<Analytics> {
    // Find the link by short code
    const link = await this.linkRepository.findOne({
      where: { shortCode },
    });

    if (!link) {
      return null;
    }

    // Create new analytics entry
    const analytics = new Analytics();
    analytics.linkId = link.id;
    analytics.ipAddress = createAnalyticsDto.ipAddress;
    analytics.referrer = createAnalyticsDto.referrer;
    analytics.userAgent = createAnalyticsDto.userAgent;
    analytics.location = createAnalyticsDto.location;

    return this.analyticsRepository.save(analytics);
  }

  async getLinkAnalytics(linkId: string): Promise<Analytics[]> {
    return this.analyticsRepository.find({
      where: { linkId },
      order: { clickedAt: 'DESC' },
    });
  }

  async getAnalyticsByUserId(userId: string): Promise<any[]> {
    // Get all links for the user
    const links = await this.linkRepository.find({
      where: { userId },
      relations: ['analytics'],
    });

    // Prepare analytics summary for each link
    return Promise.all(
      links.map(async (link) => {
        const analytics = await this.analyticsRepository.find({
          where: { linkId: link.id },
        });

        return {
          linkId: link.id,
          shortCode: link.shortCode,
          originalUrl: link.originalUrl,
          createdAt: link.createdAt,
          clickCount: analytics.length,
          analytics: analytics,
        };
      }),
    );
  }

  async getAnalyticsByGuestId(guestId: string): Promise<any[]> {
    // Get all links for the guest
    const links = await this.linkRepository.find({
      where: { guestId },
      relations: ['analytics'],
    });

    // Prepare analytics summary for each link
    return Promise.all(
      links.map(async (link) => {
        const analytics = await this.analyticsRepository.find({
          where: { linkId: link.id },
        });

        return {
          linkId: link.id,
          shortCode: link.shortCode,
          originalUrl: link.originalUrl,
          createdAt: link.createdAt,
          clickCount: analytics.length,
          analytics: analytics,
        };
      }),
    );
  }

  async getAnalyticsSummary(linkId: string): Promise<any> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId },
    });

    if (!link) {
      return null;
    }

    const analytics = await this.analyticsRepository.find({
      where: { linkId },
    });

    // Group by date
    const clicksByDate = {};
    analytics.forEach((click) => {
      const date = click.clickedAt.toISOString().split('T')[0];
      if (!clicksByDate[date]) {
        clicksByDate[date] = 0;
      }
      clicksByDate[date]++;
    });

    // Group by referrer
    const clicksByReferrer = {};
    analytics.forEach((click) => {
      const referrer = click.referrer || 'Direct';
      if (!clicksByReferrer[referrer]) {
        clicksByReferrer[referrer] = 0;
      }
      clicksByReferrer[referrer]++;
    });

    // Group by location
    const clicksByLocation = {};
    analytics.forEach((click) => {
      const location = click.location || 'Unknown';
      if (!clicksByLocation[location]) {
        clicksByLocation[location] = 0;
      }
      clicksByLocation[location]++;
    });

    return {
      linkId: link.id,
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      createdAt: link.createdAt,
      totalClicks: analytics.length,
      clicksByDate,
      clicksByReferrer,
      clicksByLocation,
    };
  }
}
