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
exports.Analytics = void 0;
const typeorm_1 = require("typeorm");
const link_entity_1 = require("./link.entity");
let Analytics = class Analytics {
    id;
    linkId;
    link;
    clickedAt;
    referrer;
    ipAddress;
    location;
    userAgent;
};
exports.Analytics = Analytics;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Analytics.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Analytics.prototype, "linkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => link_entity_1.Link, link => link.analytics),
    (0, typeorm_1.JoinColumn)({ name: 'linkId' }),
    __metadata("design:type", link_entity_1.Link)
], Analytics.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Analytics.prototype, "clickedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "referrer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Analytics.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Analytics.prototype, "userAgent", void 0);
exports.Analytics = Analytics = __decorate([
    (0, typeorm_1.Entity)()
], Analytics);
//# sourceMappingURL=analytics.entity.js.map