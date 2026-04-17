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
exports.VisitasController = void 0;
const common_1 = require("@nestjs/common");
const visitas_service_1 = require("./visitas.service");
let VisitasController = class VisitasController {
    visitasService;
    constructor(visitasService) {
        this.visitasService = visitasService;
    }
    getVisitaActiva(mesaId) {
        return this.visitasService.getVisitaActivaPorMesa(mesaId);
    }
    crearVisita(mesaId) {
        return this.visitasService.crearVisita(mesaId);
    }
    cerrarVisita(id) {
        return this.visitasService.cerrarVisita(id);
    }
    findOne(id) {
        return this.visitasService.findOne(id);
    }
};
exports.VisitasController = VisitasController;
__decorate([
    (0, common_1.Get)('mesa/:mesaId/activa'),
    __param(0, (0, common_1.Param)('mesaId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VisitasController.prototype, "getVisitaActiva", null);
__decorate([
    (0, common_1.Post)('mesa/:mesaId'),
    __param(0, (0, common_1.Param)('mesaId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VisitasController.prototype, "crearVisita", null);
__decorate([
    (0, common_1.Post)(':id/cerrar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VisitasController.prototype, "cerrarVisita", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VisitasController.prototype, "findOne", null);
exports.VisitasController = VisitasController = __decorate([
    (0, common_1.Controller)('visitas'),
    __metadata("design:paramtypes", [visitas_service_1.VisitasService])
], VisitasController);
//# sourceMappingURL=visitas.controller.js.map