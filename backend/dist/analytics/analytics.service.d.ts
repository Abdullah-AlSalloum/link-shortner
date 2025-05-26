import { Repository } from 'typeorm';
import { Analytics } from '../entities/analytics.entity';
import { Link } from '../entities/link.entity';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
export declare class AnalyticsService {
    private analyticsRepository;
    private linkRepository;
    constructor(analyticsRepository: Repository<Analytics>, linkRepository: Repository<Link>);
    recordClick(shortCode: string, createAnalyticsDto: CreateAnalyticsDto): Promise<Analytics>;
    getLinkAnalytics(linkId: string): Promise<Analytics[]>;
    getAnalyticsByUserId(userId: string): Promise<any[]>;
    getAnalyticsByGuestId(guestId: string): Promise<any[]>;
    getAnalyticsSummary(linkId: string): Promise<any>;
}
