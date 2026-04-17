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
exports.MenuDiaController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const menu_dia_service_1 = require("./menu-dia.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const enums_1 = require("../common/enums");
class CrearMenuDto {
    platoIds;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], CrearMenuDto.prototype, "platoIds", void 0);
class UpdateItemDto {
    disponible;
    stock;
    precio_oferta;
    etiqueta;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateItemDto.prototype, "disponible", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.stock !== null),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], UpdateItemDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.precio_oferta !== null),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], UpdateItemDto.prototype, "precio_oferta", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.etiqueta !== null),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], UpdateItemDto.prototype, "etiqueta", void 0);
class AgregarPlatoDto {
    platoId;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AgregarPlatoDto.prototype, "platoId", void 0);
let MenuDiaController = class MenuDiaController {
    menuDiaService;
    constructor(menuDiaService) {
        this.menuDiaService = menuDiaService;
    }
    getMenuHoy() {
        return this.menuDiaService.getMenuHoy();
    }
    deleteMenuHoy() {
        return this.menuDiaService.deleteMenuHoy();
    }
    getMenu(id) {
        return this.menuDiaService.getMenu(id);
    }
    crearMenuHoy(dto) {
        return this.menuDiaService.crearMenuHoy(dto.platoIds);
    }
    updateItem(itemId, dto) {
        return this.menuDiaService.updateItem(itemId, dto);
    }
    agregarPlato(menuId, dto) {
        return this.menuDiaService.agregarPlato(menuId, dto.platoId);
    }
    removeItem(itemId) {
        return this.menuDiaService.removeItem(itemId);
    }
};
exports.MenuDiaController = MenuDiaController;
__decorate([
    (0, common_1.Get)('hoy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenuDiaController.prototype, "getMenuHoy", null);
__decorate([
    (0, common_1.Delete)('hoy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenuDiaController.prototype, "deleteMenuHoy", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MenuDiaController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CrearMenuDto]),
    __metadata("design:returntype", void 0)
], MenuDiaController.prototype, "crearMenuHoy", null);
__decorate([
    (0, common_1.Put)('items/:itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateItemDto]),
    __metadata("design:returntype", void 0)
], MenuDiaController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Post)(':menuId/platos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('menuId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, AgregarPlatoDto]),
    __metadata("design:returntype", void 0)
], MenuDiaController.prototype, "agregarPlato", null);
__decorate([
    (0, common_1.Delete)('items/:itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.RolUsuario.MESERO),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MenuDiaController.prototype, "removeItem", null);
exports.MenuDiaController = MenuDiaController = __decorate([
    (0, common_1.Controller)('menu-dia'),
    __metadata("design:paramtypes", [menu_dia_service_1.MenuDiaService])
], MenuDiaController);
//# sourceMappingURL=menu-dia.controller.js.map