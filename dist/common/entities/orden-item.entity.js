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
exports.OrdenItem = void 0;
const typeorm_1 = require("typeorm");
const orden_entity_1 = require("./orden.entity");
const plato_entity_1 = require("./plato.entity");
const enums_1 = require("../enums");
let OrdenItem = class OrdenItem {
    id;
    orden;
    plato;
    cantidad;
    notas;
    estado;
    created_at;
};
exports.OrdenItem = OrdenItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrdenItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => orden_entity_1.Orden, (orden) => orden.items, { onDelete: 'CASCADE' }),
    __metadata("design:type", orden_entity_1.Orden)
], OrdenItem.prototype, "orden", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => plato_entity_1.Plato, { eager: true }),
    __metadata("design:type", plato_entity_1.Plato)
], OrdenItem.prototype, "plato", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], OrdenItem.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrdenItem.prototype, "notas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.EstadoItem, default: enums_1.EstadoItem.PENDIENTE }),
    __metadata("design:type", String)
], OrdenItem.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrdenItem.prototype, "created_at", void 0);
exports.OrdenItem = OrdenItem = __decorate([
    (0, typeorm_1.Entity)('orden_items')
], OrdenItem);
//# sourceMappingURL=orden-item.entity.js.map