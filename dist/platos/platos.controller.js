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
exports.PlatosController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const platos_service_1 = require("./platos.service");
const audit_service_1 = require("../gerente/audit.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const enums_1 = require("../common/enums");
class CreatePlatoDtoValidated {
    nombre;
    descripcion;
    precio;
    imagen_url;
    categoriaId;
    activo;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatoDtoValidated.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatoDtoValidated.prototype, "descripcion", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePlatoDtoValidated.prototype, "precio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlatoDtoValidated.prototype, "imagen_url", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePlatoDtoValidated.prototype, "categoriaId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePlatoDtoValidated.prototype, "activo", void 0);
class CreateCategoriaDto {
    nombre;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoriaDto.prototype, "nombre", void 0);
let PlatosController = class PlatosController {
    platosService;
    auditService;
    constructor(platosService, auditService) {
        this.platosService = platosService;
        this.auditService = auditService;
    }
    findAll() {
        return this.platosService.findAll();
    }
    findOne(id) {
        return this.platosService.findOne(id);
    }
    async create(dto, req) {
        const result = await this.platosService.create(dto);
        this.auditService.log({
            usuarioId: req.user?.id,
            usuarioEmail: req.user?.email,
            accion: 'CREAR_PLATO',
            entidad: 'plato',
            entidadId: result.id,
            detalle: { nombre: dto.nombre, precio: dto.precio },
        });
        return result;
    }
    async update(id, dto, req) {
        const result = await this.platosService.update(id, dto);
        this.auditService.log({
            usuarioId: req.user?.id,
            usuarioEmail: req.user?.email,
            accion: 'ACTUALIZAR_PLATO',
            entidad: 'plato',
            entidadId: id,
            detalle: dto,
        });
        return result;
    }
    async delete(id, req) {
        await this.platosService.delete(id);
        this.auditService.log({
            usuarioId: req.user?.id,
            usuarioEmail: req.user?.email,
            accion: 'ELIMINAR_PLATO',
            entidad: 'plato',
            entidadId: id,
        });
    }
    findAllCategorias() {
        return this.platosService.findAllCategorias();
    }
    async createCategoria(dto, req) {
        const result = await this.platosService.createCategoria(dto.nombre);
        this.auditService.log({
            usuarioId: req.user?.id,
            usuarioEmail: req.user?.email,
            accion: 'CREAR_CATEGORIA',
            entidad: 'categoria',
            entidadId: result.id,
            detalle: { nombre: dto.nombre },
        });
        return result;
    }
    async updateCategoria(id, dto, req) {
        const result = await this.platosService.updateCategoria(id, dto.nombre);
        this.auditService.log({
            usuarioId: req.user?.id,
            usuarioEmail: req.user?.email,
            accion: 'ACTUALIZAR_CATEGORIA',
            entidad: 'categoria',
            entidadId: id,
            detalle: { nombre: dto.nombre },
        });
        return result;
    }
    async deleteCategoria(id, req) {
        await this.platosService.deleteCategoria(id);
        this.auditService.log({
            usuarioId: req.user?.id,
            usuarioEmail: req.user?.email,
            accion: 'ELIMINAR_CATEGORIA',
            entidad: 'categoria',
            entidadId: id,
        });
    }
};
exports.PlatosController = PlatosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PlatosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO, enums_1.RolUsuario.GERENTE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePlatoDtoValidated, Object]),
    __metadata("design:returntype", Promise)
], PlatosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO, enums_1.RolUsuario.GERENTE),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PlatosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO, enums_1.RolUsuario.GERENTE),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlatosController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('categorias/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatosController.prototype, "findAllCategorias", null);
__decorate([
    (0, common_1.Post)('categorias'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO, enums_1.RolUsuario.GERENTE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCategoriaDto, Object]),
    __metadata("design:returntype", Promise)
], PlatosController.prototype, "createCategoria", null);
__decorate([
    (0, common_1.Put)('categorias/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO, enums_1.RolUsuario.GERENTE),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CreateCategoriaDto, Object]),
    __metadata("design:returntype", Promise)
], PlatosController.prototype, "updateCategoria", null);
__decorate([
    (0, common_1.Delete)('categorias/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO, enums_1.RolUsuario.GERENTE),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlatosController.prototype, "deleteCategoria", null);
exports.PlatosController = PlatosController = __decorate([
    (0, common_1.Controller)('platos'),
    __metadata("design:paramtypes", [platos_service_1.PlatosService,
        audit_service_1.AuditService])
], PlatosController);
//# sourceMappingURL=platos.controller.js.map