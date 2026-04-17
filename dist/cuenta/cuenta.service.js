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
exports.CuentaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../common/entities");
const enums_1 = require("../common/enums");
const visitas_service_1 = require("../visitas/visitas.service");
let CuentaService = class CuentaService {
    cuentaRepo;
    visitaRepo;
    itemRepo;
    visitasService;
    gatewayEmitter;
    setGatewayEmitter(emitter) {
        this.gatewayEmitter = emitter;
    }
    constructor(cuentaRepo, visitaRepo, itemRepo, visitasService) {
        this.cuentaRepo = cuentaRepo;
        this.visitaRepo = visitaRepo;
        this.itemRepo = itemRepo;
        this.visitasService = visitasService;
    }
    async generarCuenta(visitaId) {
        const visita = await this.visitaRepo.findOne({
            where: { id: visitaId, activa: true },
            relations: ['mesa', 'ordenes', 'ordenes.items', 'ordenes.items.plato'],
        });
        if (!visita)
            throw new common_1.NotFoundException(`Visita activa ${visitaId} no encontrada`);
        const allItems = visita.ordenes.flatMap((o) => o.items).filter((i) => i.estado !== enums_1.EstadoItem.CANCELADO);
        const total = allItems.reduce((sum, i) => sum + Number(i.plato.precio) * i.cantidad, 0);
        visita.mesa.estado = enums_1.EstadoMesa.CUENTA_PENDIENTE;
        await this.visitaRepo.manager.save(visita.mesa);
        const cuenta = this.cuentaRepo.create({ visita, total });
        const saved = await this.cuentaRepo.save(cuenta);
        this.gatewayEmitter?.emitCuentaGenerada(saved, visita.mesa.id);
        return saved;
    }
    async getCuentaByVisita(visitaId) {
        return this.cuentaRepo.findOne({
            where: { visita: { id: visitaId } },
            relations: ['visita', 'visita.mesa', 'visita.ordenes', 'visita.ordenes.items', 'visita.ordenes.items.plato'],
            order: { created_at: 'DESC' },
        });
    }
    async marcarPagado(cuentaId, metodoPago) {
        const cuenta = await this.cuentaRepo.findOne({
            where: { id: cuentaId },
            relations: ['visita', 'visita.mesa'],
        });
        if (!cuenta)
            throw new common_1.NotFoundException(`Cuenta ${cuentaId} no encontrada`);
        if (cuenta.estado_pago === enums_1.EstadoPago.PAGADO) {
            throw new common_1.BadRequestException('La cuenta ya está pagada');
        }
        cuenta.estado_pago = enums_1.EstadoPago.PAGADO;
        cuenta.metodo_pago = metodoPago;
        cuenta.fecha_pago = new Date();
        await this.cuentaRepo.save(cuenta);
        await this.visitasService.cerrarVisita(cuenta.visita.id);
        return cuenta;
    }
};
exports.CuentaService = CuentaService;
exports.CuentaService = CuentaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Cuenta)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Visita)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.OrdenItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        visitas_service_1.VisitasService])
], CuentaService);
//# sourceMappingURL=cuenta.service.js.map