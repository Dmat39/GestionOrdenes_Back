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
exports.OrdenesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../common/entities");
const enums_1 = require("../common/enums");
let OrdenesService = class OrdenesService {
    ordenRepo;
    itemRepo;
    visitaRepo;
    platoRepo;
    gatewayEmitter;
    setGatewayEmitter(emitter) {
        this.gatewayEmitter = emitter;
    }
    constructor(ordenRepo, itemRepo, visitaRepo, platoRepo) {
        this.ordenRepo = ordenRepo;
        this.itemRepo = itemRepo;
        this.visitaRepo = visitaRepo;
        this.platoRepo = platoRepo;
    }
    async crearOrden(visitaId, items) {
        const visita = await this.visitaRepo.findOne({
            where: { id: visitaId, activa: true },
            relations: ['mesa'],
        });
        if (!visita)
            throw new common_1.NotFoundException(`Visita activa ${visitaId} no encontrada`);
        const orden = this.ordenRepo.create({ visita, estado: enums_1.EstadoOrden.PENDIENTE });
        const savedOrden = await this.ordenRepo.save(orden);
        for (const i of items) {
            const plato = await this.platoRepo.findOne({ where: { id: i.platoId } });
            if (!plato)
                throw new common_1.NotFoundException(`Plato ${i.platoId} no encontrado`);
            const item = this.itemRepo.create({
                orden: savedOrden,
                plato,
                cantidad: i.cantidad,
                notas: i.notas,
                estado: enums_1.EstadoItem.PENDIENTE,
            });
            await this.itemRepo.save(item);
        }
        const ordenCompleta = await this.findOne(savedOrden.id);
        this.gatewayEmitter?.emitNuevaOrden(ordenCompleta);
        return ordenCompleta;
    }
    async findOne(id) {
        const orden = await this.ordenRepo.findOne({
            where: { id },
            relations: ['items', 'items.plato', 'visita', 'visita.mesa'],
        });
        if (!orden)
            throw new common_1.NotFoundException(`Orden ${id} no encontrada`);
        return orden;
    }
    async findByVisita(visitaId) {
        return this.ordenRepo.find({
            where: { visita: { id: visitaId } },
            relations: ['items', 'items.plato', 'visita', 'visita.mesa'],
            order: { created_at: 'ASC' },
        });
    }
    async findParaCocina() {
        return this.itemRepo.find({
            where: [
                { estado: enums_1.EstadoItem.PENDIENTE },
                { estado: enums_1.EstadoItem.EN_PREPARACION },
            ],
            relations: ['plato', 'plato.categoria', 'orden', 'orden.visita', 'orden.visita.mesa'],
            order: { created_at: 'ASC' },
        });
    }
    async cambiarEstadoItem(itemId, estado) {
        const item = await this.itemRepo.findOne({
            where: { id: itemId },
            relations: ['orden', 'orden.items', 'orden.visita', 'orden.visita.mesa', 'plato'],
        });
        if (!item)
            throw new common_1.NotFoundException(`Item ${itemId} no encontrado`);
        item.estado = estado;
        const saved = await this.itemRepo.save(item);
        this.gatewayEmitter?.emitItemActualizado(saved);
        const orden = await this.ordenRepo.findOne({
            where: { id: item.orden.id },
            relations: ['items', 'visita', 'visita.mesa'],
        });
        if (orden) {
            const todosListos = orden.items.every((i) => i.estado === enums_1.EstadoItem.LISTO || i.estado === enums_1.EstadoItem.CANCELADO);
            const algunoListo = orden.items.some((i) => i.estado === enums_1.EstadoItem.LISTO);
            if (todosListos && algunoListo) {
                orden.estado = enums_1.EstadoOrden.LISTO;
                await this.ordenRepo.save(orden);
                this.gatewayEmitter?.emitOrdenLista(orden);
            }
        }
        return saved;
    }
    async cancelarOrden(ordenId) {
        const orden = await this.findOne(ordenId);
        if (orden.estado !== enums_1.EstadoOrden.PENDIENTE) {
            throw new common_1.BadRequestException('Solo se puede cancelar una orden en estado PENDIENTE');
        }
        orden.estado = enums_1.EstadoOrden.CANCELADO;
        return this.ordenRepo.save(orden);
    }
    async marcarEntregado(ordenId) {
        const orden = await this.findOne(ordenId);
        orden.estado = enums_1.EstadoOrden.ENTREGADO;
        for (const item of orden.items) {
            if (item.estado === enums_1.EstadoItem.LISTO) {
                item.estado = enums_1.EstadoItem.ENTREGADO;
                await this.itemRepo.save(item);
            }
        }
        return this.ordenRepo.save(orden);
    }
};
exports.OrdenesService = OrdenesService;
exports.OrdenesService = OrdenesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Orden)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.OrdenItem)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Visita)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Plato)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdenesService);
//# sourceMappingURL=ordenes.service.js.map