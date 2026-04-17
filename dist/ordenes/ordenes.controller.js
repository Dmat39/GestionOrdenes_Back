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
exports.OrdenesController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const ordenes_service_1 = require("./ordenes.service");
const audit_service_1 = require("../gerente/audit.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const enums_1 = require("../common/enums");
class OrdenItemDto {
    platoId;
    cantidad;
    notas;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], OrdenItemDto.prototype, "platoId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrdenItemDto.prototype, "cantidad", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrdenItemDto.prototype, "notas", void 0);
class CreateOrdenDto {
    items;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrdenItemDto),
    __metadata("design:type", Array)
], CreateOrdenDto.prototype, "items", void 0);
class UpdateItemEstadoDto {
    estado;
}
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.EstadoItem),
    __metadata("design:type", String)
], UpdateItemEstadoDto.prototype, "estado", void 0);
let OrdenesController = class OrdenesController {
    ordenesService;
    auditService;
    constructor(ordenesService, auditService) {
        this.ordenesService = ordenesService;
        this.auditService = auditService;
    }
    crearOrden(visitaId, dto) {
        return this.ordenesService.crearOrden(visitaId, dto.items);
    }
    findByVisita(visitaId) {
        return this.ordenesService.findByVisita(visitaId);
    }
    findParaCocina() {
        return this.ordenesService.findParaCocina();
    }
    findOne(id) {
        return this.ordenesService.findOne(id);
    }
    async cambiarEstadoItem(itemId, dto, req) {
        const result = await this.ordenesService.cambiarEstadoItem(itemId, dto.estado);
        this.auditService.log({
            usuarioId: req.user?.id,
            usuarioEmail: req.user?.email,
            accion: 'CAMBIAR_ESTADO_ITEM',
            entidad: 'orden_item',
            entidadId: itemId,
            detalle: { estado: dto.estado },
        });
        return result;
    }
    async cancelarOrden(id, req) {
        const result = await this.ordenesService.cancelarOrden(id);
        this.auditService.log({
            usuarioId: req.user?.id,
            usuarioEmail: req.user?.email,
            accion: 'CANCELAR_ORDEN',
            entidad: 'orden',
            entidadId: id,
        });
        return result;
    }
    async marcarEntregado(id, req) {
        const result = await this.ordenesService.marcarEntregado(id);
        this.auditService.log({
            usuarioId: req.user?.id,
            usuarioEmail: req.user?.email,
            accion: 'ENTREGAR_ORDEN',
            entidad: 'orden',
            entidadId: id,
        });
        return result;
    }
};
exports.OrdenesController = OrdenesController;
__decorate([
    (0, common_1.Post)('visita/:visitaId'),
    __param(0, (0, common_1.Param)('visitaId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CreateOrdenDto]),
    __metadata("design:returntype", void 0)
], OrdenesController.prototype, "crearOrden", null);
__decorate([
    (0, common_1.Get)('visita/:visitaId'),
    __param(0, (0, common_1.Param)('visitaId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdenesController.prototype, "findByVisita", null);
__decorate([
    (0, common_1.Get)('cocina/items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.COCINERO, enums_1.RolUsuario.MESERO),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdenesController.prototype, "findParaCocina", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrdenesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('items/:itemId/estado'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.COCINERO, enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateItemEstadoDto, Object]),
    __metadata("design:returntype", Promise)
], OrdenesController.prototype, "cambiarEstadoItem", null);
__decorate([
    (0, common_1.Put)(':id/cancelar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrdenesController.prototype, "cancelarOrden", null);
__decorate([
    (0, common_1.Put)(':id/entregar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrdenesController.prototype, "marcarEntregado", null);
exports.OrdenesController = OrdenesController = __decorate([
    (0, common_1.Controller)('ordenes'),
    __metadata("design:paramtypes", [ordenes_service_1.OrdenesService,
        audit_service_1.AuditService])
], OrdenesController);
//# sourceMappingURL=ordenes.controller.js.map