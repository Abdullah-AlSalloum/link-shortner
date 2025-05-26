import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    recordClick(shortCode: string, createAnalyticsDto: CreateAnalyticsDto): Promise<import("../entities/analytics.entity").Analytics>;
    getUserAnalytics(req: any): Promise<any[]>;
    getGuestAnalytics(guestId: string): Promise<any[]>;
    getLinkAnalytics(linkId: string): Promise<import("../entities/analytics.entity").Analytics[]>;
    getAnalyticsSummary(linkId: string): Promise<any>;
}
