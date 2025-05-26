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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const guest_entity_1 = require("./guest.entity");
const analytics_entity_1 = require("./analytics.entity");
let Link = class Link {
    id;
    originalUrl;
    shortCode;
    userId;
    guestId;
    user;
    guest;
    analytics;
    createdAt;
    updatedAt;
    expiresAt;
};
exports.Link = Link;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Link.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Link.prototype, "originalUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Link.prototype, "shortCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Link.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Link.prototype, "guestId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.links, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Link.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => guest_entity_1.Guest, guest => guest.links, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'guestId' }),
    __metadata("design:type", guest_entity_1.Guest)
], Link.prototype, "guest", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => analytics_entity_1.Analytics, analytics => analytics.link),
    __metadata("design:type", Array)
], Link.prototype, "analytics", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Link.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Link.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Link.prototype, "expiresAt", void 0);
exports.Link = Link = __decorate([
    (0, typeorm_1.Entity)()
], Link);
//# sourceMappingURL=link.entity.js.map