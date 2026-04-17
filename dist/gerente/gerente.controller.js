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
exports.GerenteController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const gerente_service_1 = require("./gerente.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const enums_1 = require("../common/enums");
class CreateUsuarioDto {
    email;
    password;
    rol;
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.RolUsuario),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "rol", void 0);
class UpdatePasswordDto {
    password;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UpdatePasswordDto.prototype, "password", void 0);
let GerenteController = class GerenteController {
    gerenteService;
    constructor(gerenteService) {
        this.gerenteService = gerenteService;
    }
    getDashboard() {
        return this.gerenteService.getDashboardHoy();
    }
    getVentasDia(desde, hasta) {
        return this.gerenteService.getVentasPorDia(desde, hasta);
    }
    getVentasDetalle(desde, hasta) {
        return this.gerenteService.getVentasDetalle(desde, hasta);
    }
    getRanking(desde, hasta) {
        return this.gerenteService.getRankingPlatos(desde, hasta);
    }
    getAuditoria(desde, hasta, usuarioId, accion, limit) {
        return this.gerenteService.getAuditoria({
            desde,
            hasta,
            usuarioId: usuarioId ? parseInt(usuarioId, 10) : undefined,
            accion,
            limit: limit ? parseInt(limit, 10) : undefined,
        });
    }
    getUsuarios() {
        return this.gerenteService.getUsuarios();
    }
    createUsuario(dto) {
        return this.gerenteService.createUsuario(dto.email, dto.password, dto.rol);
    }
    toggleActivo(id) {
        return this.gerenteService.toggleActivoUsuario(id);
    }
    updatePassword(id, dto) {
        return this.gerenteService.updatePasswordUsuario(id, dto.password);
    }
};
exports.GerenteController = GerenteController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GerenteController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('ventas/dia'),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GerenteController.prototype, "getVentasDia", null);
__decorate([
    (0, common_1.Get)('ventas/detalle'),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GerenteController.prototype, "getVentasDetalle", null);
__decorate([
    (0, common_1.Get)('platos/ranking'),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GerenteController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Get)('auditoria'),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __param(2, (0, common_1.Query)('usuarioId')),
    __param(3, (0, common_1.Query)('accion')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], GerenteController.prototype, "getAuditoria", null);
__decorate([
    (0, common_1.Get)('usuarios'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GerenteController.prototype, "getUsuarios", null);
__decorate([
    (0, common_1.Post)('usuarios'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUsuarioDto]),
    __metadata("design:returntype", void 0)
], GerenteController.prototype, "createUsuario", null);
__decorate([
    (0, common_1.Patch)('usuarios/:id/toggle'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GerenteController.prototype, "toggleActivo", null);
__decorate([
    (0, common_1.Patch)('usuarios/:id/password'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdatePasswordDto]),
    __metadata("design:returntype", void 0)
], GerenteController.prototype, "updatePassword", null);
exports.GerenteController = GerenteController = __decorate([
    (0, common_1.Controller)('gerente'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.GERENTE),
    __metadata("design:paramtypes", [gerente_service_1.GerenteService])
], GerenteController);
//# sourceMappingURL=gerente.controller.js.map