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
exports.VisitasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../common/entities");
const enums_1 = require("../common/enums");
const mesas_service_1 = require("../mesas/mesas.service");
let VisitasService = class VisitasService {
    visitaRepo;
    mesaRepo;
    mesasService;
    constructor(visitaRepo, mesaRepo, mesasService) {
        this.visitaRepo = visitaRepo;
        this.mesaRepo = mesaRepo;
        this.mesasService = mesasService;
    }
    async getVisitaActivaPorMesa(mesaId) {
        return this.visitaRepo.findOne({
            where: { mesa: { id: mesaId }, activa: true },
            relations: ['mesa', 'ordenes', 'ordenes.items', 'ordenes.items.plato'],
        });
    }
    async crearVisita(mesaId) {
        const mesa = await this.mesasService.findOne(mesaId);
        const existing = await this.visitaRepo.findOne({
            where: { mesa: { id: mesaId }, activa: true },
        });
        if (existing)
            return existing;
        const visita = this.visitaRepo.create({ mesa, activa: true });
        const saved = await this.visitaRepo.save(visita);
        await this.mesasService.cambiarEstado(mesaId, enums_1.EstadoMesa.OCUPADA);
        return saved;
    }
    async cerrarVisita(visitaId) {
        const visita = await this.visitaRepo.findOne({
            where: { id: visitaId },
            relations: ['mesa'],
        });
        if (!visita)
            throw new common_1.NotFoundException(`Visita ${visitaId} no encontrada`);
        visita.activa = false;
        await this.visitaRepo.save(visita);
        await this.mesasService.cambiarEstado(visita.mesa.id, enums_1.EstadoMesa.LIBRE);
        return visita;
    }
    async findOne(id) {
        const visita = await this.visitaRepo.findOne({
            where: { id },
            relations: ['mesa', 'ordenes', 'ordenes.items', 'ordenes.items.plato'],
        });
        if (!visita)
            throw new common_1.NotFoundException(`Visita ${id} no encontrada`);
        return visita;
    }
};
exports.VisitasService = VisitasService;
exports.VisitasService = VisitasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Visita)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Mesa)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        mesas_service_1.MesasService])
], VisitasService);
//# sourceMappingURL=visitas.service.js.map