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
exports.Orden = void 0;
const typeorm_1 = require("typeorm");
const visita_entity_1 = require("./visita.entity");
const orden_item_entity_1 = require("./orden-item.entity");
const enums_1 = require("../enums");
let Orden = class Orden {
    id;
    visita;
    estado;
    created_at;
    items;
};
exports.Orden = Orden;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Orden.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => visita_entity_1.Visita, (visita) => visita.ordenes),
    __metadata("design:type", visita_entity_1.Visita)
], Orden.prototype, "visita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.EstadoOrden, default: enums_1.EstadoOrden.PENDIENTE }),
    __metadata("design:type", String)
], Orden.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Orden.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orden_item_entity_1.OrdenItem, (item) => item.orden, { cascade: true }),
    __metadata("design:type", Array)
], Orden.prototype, "items", void 0);
exports.Orden = Orden = __decorate([
    (0, typeorm_1.Entity)('ordenes')
], Orden);
//# sourceMappingURL=orden.entity.js.map