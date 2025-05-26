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
exports.UrlService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const link_entity_1 = require("../entities/link.entity");
const guest_entity_1 = require("../entities/guest.entity");
const nanoid_1 = require("nanoid");
let UrlService = class UrlService {
    linkRepository;
    guestRepository;
    constructor(linkRepository, guestRepository) {
        this.linkRepository = linkRepository;
        this.guestRepository = guestRepository;
    }
    generateShortCode() {
        return (0, nanoid_1.nanoid)(7);
    }
    async shortenUrl(originalUrl, guestId, userId) {
        const shortCode = this.generateShortCode();
        const link = new link_entity_1.Link();
        link.originalUrl = originalUrl;
        link.shortCode = shortCode;
        if (userId) {
            link.userId = userId;
        }
        else if (guestId) {
            let guest = await this.guestRepository.findOne({ where: { guestId } });
            if (!guest) {
                guest = new guest_entity_1.Guest();
                guest.guestId = guestId;
                await this.guestRepository.save(guest);
            }
            link.guestId = guest.id;
        }
        return this.linkRepository.save(link);
    }
    async getOriginalUrl(shortCode) {
        const link = await this.linkRepository.findOne({ where: { shortCode } });
        return link ? link.originalUrl : null;
    }
    async getLinksByGuestId(guestId) {
        const guest = await this.guestRepository.findOne({
            where: { guestId },
            relations: ['links']
        });
        return guest ? guest.links : [];
    }
    async getLinksByUserId(userId) {
        return this.linkRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
};
exports.UrlService = UrlService;
exports.UrlService = UrlService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(link_entity_1.Link)),
    __param(1, (0, typeorm_1.InjectRepository)(guest_entity_1.Guest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UrlService);
//# sourceMappingURL=url.service.js.map