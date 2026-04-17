"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GerenteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../common/entities");
const gerente_controller_1 = require("./gerente.controller");
const gerente_service_1 = require("./gerente.service");
const audit_module_1 = require("./audit.module");
let GerenteModule = class GerenteModule {
};
exports.GerenteModule = GerenteModule;
exports.GerenteModule = GerenteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.AuditLog, entities_1.Cuenta, entities_1.Orden, entities_1.OrdenItem, entities_1.Visita, entities_1.Usuario]),
            audit_module_1.AuditModule,
        ],
        controllers: [gerente_controller_1.GerenteController],
        providers: [gerente_service_1.GerenteService],
    })
], GerenteModule);
//# sourceMappingURL=gerente.module.js.map