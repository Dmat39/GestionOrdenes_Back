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
exports.MesasController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const mesas_service_1 = require("./mesas.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const enums_1 = require("../common/enums");
class CreateMesaDto {
    numero;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateMesaDto.prototype, "numero", void 0);
class UpdateEstadoDto {
    estado;
}
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.EstadoMesa),
    __metadata("design:type", String)
], UpdateEstadoDto.prototype, "estado", void 0);
let MesasController = class MesasController {
    mesasService;
    constructor(mesasService) {
        this.mesasService = mesasService;
    }
    findAll() {
        return this.mesasService.findAll();
    }
    findOne(id) {
        return this.mesasService.findOne(id);
    }
    create(dto) {
        return this.mesasService.create(dto.numero);
    }
    regenerarQR(id) {
        return this.mesasService.regenerarQR(id);
    }
    cambiarEstado(id, dto) {
        return this.mesasService.cambiarEstado(id, dto.estado);
    }
    delete(id) {
        return this.mesasService.delete(id);
    }
};
exports.MesasController = MesasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MesasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MesasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateMesaDto]),
    __metadata("design:returntype", void 0)
], MesasController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/qr'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MesasController.prototype, "regenerarQR", null);
__decorate([
    (0, common_1.Put)(':id/estado'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateEstadoDto]),
    __metadata("design:returntype", void 0)
], MesasController.prototype, "cambiarEstado", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MesasController.prototype, "delete", null);
exports.MesasController = MesasController = __decorate([
    (0, common_1.Controller)('mesas'),
    __metadata("design:paramtypes", [mesas_service_1.MesasService])
], MesasController);
//# sourceMappingURL=mesas.controller.js.map