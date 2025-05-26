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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_analytics_dto_1 = require("./dto/create-analytics.dto");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async recordClick(shortCode, createAnalyticsDto) {
        return this.analyticsService.recordClick(shortCode, createAnalyticsDto);
    }
    async getUserAnalytics(req) {
        return this.analyticsService.getAnalyticsByUserId(req.user.userId);
    }
    async getGuestAnalytics(guestId) {
        return this.analyticsService.getAnalyticsByGuestId(guestId);
    }
    async getLinkAnalytics(linkId) {
        return this.analyticsService.getLinkAnalytics(linkId);
    }
    async getAnalyticsSummary(linkId) {
        return this.analyticsService.getAnalyticsSummary(linkId);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Post)(':shortCode/record'),
    __param(0, (0, common_1.Param)('shortCode')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_analytics_dto_1.CreateAnalyticsDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "recordClick", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getUserAnalytics", null);
__decorate([
    (0, common_1.Get)('guest'),
    __param(0, (0, common_1.Query)('guestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getGuestAnalytics", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('link/:linkId'),
    __param(0, (0, common_1.Param)('linkId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getLinkAnalytics", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('summary/:linkId'),
    __param(0, (0, common_1.Param)('linkId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAnalyticsSummary", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map