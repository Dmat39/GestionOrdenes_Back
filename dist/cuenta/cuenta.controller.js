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
exports.CuentaController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const cuenta_service_1 = require("./cuenta.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const enums_1 = require("../common/enums");
class PagarDto {
    metodoPago;
}
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.MetodoPago),
    __metadata("design:type", String)
], PagarDto.prototype, "metodoPago", void 0);
let CuentaController = class CuentaController {
    cuentaService;
    constructor(cuentaService) {
        this.cuentaService = cuentaService;
    }
    generarCuenta(visitaId) {
        return this.cuentaService.generarCuenta(visitaId);
    }
    getCuenta(visitaId) {
        return this.cuentaService.getCuentaByVisita(visitaId);
    }
    marcarPagado(id, dto) {
        return this.cuentaService.marcarPagado(id, dto.metodoPago);
    }
};
exports.CuentaController = CuentaController;
__decorate([
    (0, common_1.Post)('visita/:visitaId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('visitaId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CuentaController.prototype, "generarCuenta", null);
__decorate([
    (0, common_1.Get)('visita/:visitaId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('visitaId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CuentaController.prototype, "getCuenta", null);
__decorate([
    (0, common_1.Put)(':id/pagar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, PagarDto]),
    __metadata("design:returntype", void 0)
], CuentaController.prototype, "marcarPagado", null);
exports.CuentaController = CuentaController = __decorate([
    (0, common_1.Controller)('cuenta'),
    __metadata("design:paramtypes", [cuenta_service_1.CuentaService])
], CuentaController);
//# sourceMappingURL=cuenta.controller.js.map