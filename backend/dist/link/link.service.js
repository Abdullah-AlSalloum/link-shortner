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
exports.LinkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const link_entity_1 = require("../entities/link.entity");
const nanoid_1 = require("nanoid");
let LinkService = class LinkService {
    linkRepository;
    constructor(linkRepository) {
        this.linkRepository = linkRepository;
    }
    async getUserLinks(userId) {
        return this.linkRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async createLink(userId, createLinkDto) {
        const shortCode = createLinkDto.customShortCode || (0, nanoid_1.nanoid)(7);
        const existingLink = await this.linkRepository.findOne({
            where: { shortCode },
        });
        if (existingLink) {
            throw new common_1.ForbiddenException('This short code is already in use');
        }
        const link = new link_entity_1.Link();
        link.originalUrl = createLinkDto.originalUrl;
        link.shortCode = shortCode;
        link.userId = userId;
        if (createLinkDto.expiresAt) {
            link.expiresAt = new Date(createLinkDto.expiresAt);
        }
        return this.linkRepository.save(link);
    }
    async getLink(userId, id) {
        const link = await this.linkRepository.findOne({
            where: { id },
        });
        if (!link) {
            throw new common_1.NotFoundException('Link not found');
        }
        if (link.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this link');
        }
        return link;
    }
    async updateLink(userId, id, updateLinkDto) {
        const link = await this.getLink(userId, id);
        if (updateLinkDto.originalUrl) {
            link.originalUrl = updateLinkDto.originalUrl;
        }
        if (updateLinkDto.customShortCode) {
            const existingLink = await this.linkRepository.findOne({
                where: { shortCode: updateLinkDto.customShortCode },
            });
            if (existingLink && existingLink.id !== id) {
                throw new common_1.ForbiddenException('This short code is already in use');
            }
            link.shortCode = updateLinkDto.customShortCode;
        }
        if (updateLinkDto.expiresAt) {
            link.expiresAt = new Date(updateLinkDto.expiresAt);
        }
        return this.linkRepository.save(link);
    }
    async deleteLink(userId, id) {
        const link = await this.getLink(userId, id);
        await this.linkRepository.remove(link);
    }
};
exports.LinkService = LinkService;
exports.LinkService = LinkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(link_entity_1.Link)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LinkService);
//# sourceMappingURL=link.service.js.map