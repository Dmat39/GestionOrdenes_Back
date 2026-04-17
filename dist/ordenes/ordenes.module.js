"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../common/entities");
const ordenes_controller_1 = require("./ordenes.controller");
const ordenes_service_1 = require("./ordenes.service");
const visitas_module_1 = require("../visitas/visitas.module");
const audit_module_1 = require("../gerente/audit.module");
let OrdenesModule = class OrdenesModule {
};
exports.OrdenesModule = OrdenesModule;
exports.OrdenesModule = OrdenesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.Orden, entities_1.OrdenItem, entities_1.Visita, entities_1.Plato]),
            visitas_module_1.VisitasModule,
            audit_module_1.AuditModule,
        ],
        controllers: [ordenes_controller_1.OrdenesController],
        providers: [ordenes_service_1.OrdenesService],
        exports: [ordenes_service_1.OrdenesService],
    })
], OrdenesModule);
//# sourceMappingURL=ordenes.module.js.map