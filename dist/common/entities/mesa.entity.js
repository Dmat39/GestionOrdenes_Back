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
exports.Mesa = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../enums");
const visita_entity_1 = require("./visita.entity");
let Mesa = class Mesa {
    id;
    numero;
    qr_code;
    estado;
    visitas;
};
exports.Mesa = Mesa;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Mesa.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", Number)
], Mesa.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Mesa.prototype, "qr_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.EstadoMesa, default: enums_1.EstadoMesa.LIBRE }),
    __metadata("design:type", String)
], Mesa.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => visita_entity_1.Visita, (visita) => visita.mesa),
    __metadata("design:type", Array)
], Mesa.prototype, "visitas", void 0);
exports.Mesa = Mesa = __decorate([
    (0, typeorm_1.Entity)('mesas')
], Mesa);
//# sourceMappingURL=mesa.entity.js.map