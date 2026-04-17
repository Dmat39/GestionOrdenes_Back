"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./common/entities");
const auth_module_1 = require("./auth/auth.module");
const mesas_module_1 = require("./mesas/mesas.module");
const platos_module_1 = require("./platos/platos.module");
const menu_dia_module_1 = require("./menu-dia/menu-dia.module");
const visitas_module_1 = require("./visitas/visitas.module");
const ordenes_module_1 = require("./ordenes/ordenes.module");
const cuenta_module_1 = require("./cuenta/cuenta.module");
const gateway_module_1 = require("./gateway/gateway.module");
const gerente_module_1 = require("./gerente/gerente.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    url: config.get('DATABASE_URL'),
                    entities: [
                        entities_1.Usuario, entities_1.Mesa, entities_1.Categoria, entities_1.Plato,
                        entities_1.MenuDia, entities_1.MenuDiaItem, entities_1.Visita,
                        entities_1.Orden, entities_1.OrdenItem, entities_1.Cuenta, entities_1.AuditLog,
                    ],
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            mesas_module_1.MesasModule,
            platos_module_1.PlatosModule,
            menu_dia_module_1.MenuDiaModule,
            visitas_module_1.VisitasModule,
            ordenes_module_1.OrdenesModule,
            cuenta_module_1.CuentaModule,
            gateway_module_1.GatewayModule,
            gerente_module_1.GerenteModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map