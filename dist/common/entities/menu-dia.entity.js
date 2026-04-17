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
exports.MenuDia = void 0;
const typeorm_1 = require("typeorm");
const menu_dia_item_entity_1 = require("./menu-dia-item.entity");
let MenuDia = class MenuDia {
    id;
    fecha;
    items;
};
exports.MenuDia = MenuDia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MenuDia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', unique: true }),
    __metadata("design:type", String)
], MenuDia.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => menu_dia_item_entity_1.MenuDiaItem, (item) => item.menuDia, { cascade: true }),
    __metadata("design:type", Array)
], MenuDia.prototype, "items", void 0);
exports.MenuDia = MenuDia = __decorate([
    (0, typeorm_1.Entity)('menu_dia')
], MenuDia);
//# sourceMappingURL=menu-dia.entity.js.map