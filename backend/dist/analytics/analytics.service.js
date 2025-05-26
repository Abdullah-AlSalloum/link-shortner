"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const analytics_entity_1 = require("../entities/analytics.entity");
const link_entity_1 = require("../entities/link.entity");
let AnalyticsService = class AnalyticsService {
    analyticsRepository;
    linkRepository;
    constructor(analyticsRepository, linkRepository) {
        this.analyticsRepository = analyticsRepository;
        this.linkRepository = linkRepository;
    }
    async recordClick(shortCode, createAnalyticsDto) {
        const link = await this.linkRepository.findOne({
            where: { shortCode },
        });
        if (!link) {
            return null;
        }
        const analytics = new analytics_entity_1.Analytics();
        analytics.linkId = link.id;
        analytics.ipAddress = createAnalyticsDto.ipAddress;
        analytics.referrer = createAnalyticsDto.referrer;
        analytics.userAgent = createAnalyticsDto.userAgent;
        analytics.location = createAnalyticsDto.location;
        return this.analyticsRepository.save(analytics);
    }
    async getLinkAnalytics(linkId) {
        return this.analyticsRepository.find({
            where: { linkId },
            order: { clickedAt: 'DESC' },
        });
    }
    async getAnalyticsByUserId(userId) {
        const links = await this.linkRepository.find({
            where: { userId },
            relations: ['analytics'],
        });
        return Promise.all(links.map(async (link) => {
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
        }));
    }
    async getAnalyticsByGuestId(guestId) {
        const links = await this.linkRepository.find({
            where: { guestId },
            relations: ['analytics'],
        });
        return Promise.all(links.map(async (link) => {
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
        }));
    }
    async getAnalyticsSummary(linkId) {
        const link = await this.linkRepository.findOne({
            where: { id: linkId },
        });
        if (!link) {
            return null;
        }
        const analytics = await this.analyticsRepository.find({
            where: { linkId },
        });
        const clicksByDate = {};
        analytics.forEach((click) => {
            const date = click.clickedAt.toISOString().split('T')[0];
            if (!clicksByDate[date]) {
                clicksByDate[date] = 0;
            }
            clicksByDate[date]++;
        });
        const clicksByReferrer = {};
        analytics.forEach((click) => {
            const referrer = click.referrer || 'Direct';
            if (!clicksByReferrer[referrer]) {
                clicksByReferrer[referrer] = 0;
            }
            clicksByReferrer[referrer]++;
        });
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(analytics_entity_1.Analytics)),
    __param(1, (0, typeorm_1.InjectRepository)(link_entity_1.Link)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map