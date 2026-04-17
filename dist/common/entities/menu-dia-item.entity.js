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
exports.MenuDiaItem = void 0;
const typeorm_1 = require("typeorm");
const menu_dia_entity_1 = require("./menu-dia.entity");
const plato_entity_1 = require("./plato.entity");
let MenuDiaItem = class MenuDiaItem {
    id;
    menuDia;
    plato;
    disponible;
    stock;
    precio_oferta;
    etiqueta;
};
exports.MenuDiaItem = MenuDiaItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MenuDiaItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_dia_entity_1.MenuDia, (menu) => menu.items, { onDelete: 'CASCADE' }),
    __metadata("design:type", menu_dia_entity_1.MenuDia)
], MenuDiaItem.prototype, "menuDia", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => plato_entity_1.Plato, (plato) => plato.menuItems, { eager: true }),
    __metadata("design:type", plato_entity_1.Plato)
], MenuDiaItem.prototype, "plato", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], MenuDiaItem.prototype, "disponible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], MenuDiaItem.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], MenuDiaItem.prototype, "precio_oferta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], MenuDiaItem.prototype, "etiqueta", void 0);
exports.MenuDiaItem = MenuDiaItem = __decorate([
    (0, typeorm_1.Entity)('menu_dia_items')
], MenuDiaItem);
//# sourceMappingURL=menu-dia-item.entity.js.map