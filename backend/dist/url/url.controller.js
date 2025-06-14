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
exports.UrlController = void 0;
const common_1 = require("@nestjs/common");
const url_service_1 = require("./url.service");
const create_url_dto_1 = require("./dto/create-url.dto");
let UrlController = class UrlController {
    urlService;
    constructor(urlService) {
        this.urlService = urlService;
    }
    async shortenUrl(createUrlDto) {
        return this.urlService.shortenUrl(createUrlDto.originalUrl, createUrlDto.guestId, createUrlDto.userId);
    }
    async getOriginalUrl(shortCode) {
        const originalUrl = await this.urlService.getOriginalUrl(shortCode);
        return { originalUrl: originalUrl || '' };
    }
    async getLinksByGuestId(guestId) {
        return this.urlService.getLinksByGuestId(guestId);
    }
    async getLinksByUserId(userId) {
        return this.urlService.getLinksByUserId(userId);
    }
};
exports.UrlController = UrlController;
__decorate([
    (0, common_1.Post)('shorten'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_url_dto_1.CreateUrlDto]),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "shortenUrl", null);
__decorate([
    (0, common_1.Get)(':shortCode'),
    __param(0, (0, common_1.Param)('shortCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "getOriginalUrl", null);
__decorate([
    (0, common_1.Get)('guest/links'),
    __param(0, (0, common_1.Query)('guestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "getLinksByGuestId", null);
__decorate([
    (0, common_1.Get)('user/links'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UrlController.prototype, "getLinksByUserId", null);
exports.UrlController = UrlController = __decorate([
    (0, common_1.Controller)('url'),
    __metadata("design:paramtypes", [url_service_1.UrlService])
], UrlController);
//# sourceMappingURL=url.controller.js.map