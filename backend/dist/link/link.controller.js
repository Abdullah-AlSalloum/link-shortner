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
exports.LinkController = void 0;
const common_1 = require("@nestjs/common");
const link_service_1 = require("./link.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_link_dto_1 = require("./dto/create-link.dto");
const update_link_dto_1 = require("./dto/update-link.dto");
let LinkController = class LinkController {
    linkService;
    constructor(linkService) {
        this.linkService = linkService;
    }
    async getUserLinks(req) {
        return this.linkService.getUserLinks(req.user.userId);
    }
    async createLink(req, createLinkDto) {
        return this.linkService.createLink(req.user.userId, createLinkDto);
    }
    async getLink(req, id) {
        return this.linkService.getLink(req.user.userId, id);
    }
    async updateLink(req, id, updateLinkDto) {
        return this.linkService.updateLink(req.user.userId, id, updateLinkDto);
    }
    async deleteLink(req, id) {
        return this.linkService.deleteLink(req.user.userId, id);
    }
};
exports.LinkController = LinkController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LinkController.prototype, "getUserLinks", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_link_dto_1.CreateLinkDto]),
    __metadata("design:returntype", Promise)
], LinkController.prototype, "createLink", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LinkController.prototype, "getLink", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_link_dto_1.UpdateLinkDto]),
    __metadata("design:returntype", Promise)
], LinkController.prototype, "updateLink", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LinkController.prototype, "deleteLink", null);
exports.LinkController = LinkController = __decorate([
    (0, common_1.Controller)('links'),
    __metadata("design:paramtypes", [link_service_1.LinkService])
], LinkController);
//# sourceMappingURL=link.controller.js.map