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
exports.Visita = void 0;
const typeorm_1 = require("typeorm");
const mesa_entity_1 = require("./mesa.entity");
const orden_entity_1 = require("./orden.entity");
const cuenta_entity_1 = require("./cuenta.entity");
let Visita = class Visita {
    id;
    mesa;
    activa;
    created_at;
    ordenes;
    cuentas;
};
exports.Visita = Visita;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Visita.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => mesa_entity_1.Mesa, (mesa) => mesa.visitas),
    __metadata("design:type", mesa_entity_1.Mesa)
], Visita.prototype, "mesa", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Visita.prototype, "activa", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Visita.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orden_entity_1.Orden, (orden) => orden.visita),
    __metadata("design:type", Array)
], Visita.prototype, "ordenes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cuenta_entity_1.Cuenta, (cuenta) => cuenta.visita),
    __metadata("design:type", Array)
], Visita.prototype, "cuentas", void 0);
exports.Visita = Visita = __decorate([
    (0, typeorm_1.Entity)('visitas')
], Visita);
//# sourceMappingURL=visita.entity.js.map