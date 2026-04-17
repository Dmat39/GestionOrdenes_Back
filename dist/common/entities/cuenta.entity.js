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
exports.Cuenta = void 0;
const typeorm_1 = require("typeorm");
const visita_entity_1 = require("./visita.entity");
const enums_1 = require("../enums");
let Cuenta = class Cuenta {
    id;
    visita;
    total;
    metodo_pago;
    estado_pago;
    niubiz_session_key;
    niubiz_transaction_id;
    fecha_pago;
    created_at;
};
exports.Cuenta = Cuenta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cuenta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => visita_entity_1.Visita, (visita) => visita.cuentas),
    __metadata("design:type", visita_entity_1.Visita)
], Cuenta.prototype, "visita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Cuenta.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.MetodoPago, nullable: true }),
    __metadata("design:type", Object)
], Cuenta.prototype, "metodo_pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.EstadoPago, default: enums_1.EstadoPago.PENDIENTE }),
    __metadata("design:type", String)
], Cuenta.prototype, "estado_pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cuenta.prototype, "niubiz_session_key", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cuenta.prototype, "niubiz_transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Cuenta.prototype, "fecha_pago", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Cuenta.prototype, "created_at", void 0);
exports.Cuenta = Cuenta = __decorate([
    (0, typeorm_1.Entity)('cuentas')
], Cuenta);
//# sourceMappingURL=cuenta.entity.js.map