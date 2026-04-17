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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestauranteGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const ordenes_service_1 = require("../ordenes/ordenes.service");
const cuenta_service_1 = require("../cuenta/cuenta.service");
const menu_dia_service_1 = require("../menu-dia/menu-dia.service");
let RestauranteGateway = class RestauranteGateway {
    ordenesService;
    cuentaService;
    menuDiaService;
    server;
    constructor(ordenesService, cuentaService, menuDiaService) {
        this.ordenesService = ordenesService;
        this.cuentaService = cuentaService;
        this.menuDiaService = menuDiaService;
    }
    afterInit() {
        this.ordenesService.setGatewayEmitter({
            emitNuevaOrden: (orden) => this.emitNuevaOrden(orden),
            emitItemActualizado: (item) => this.emitItemActualizado(item),
            emitOrdenLista: (orden) => this.emitOrdenLista(orden),
        });
        this.cuentaService.setGatewayEmitter({
            emitCuentaGenerada: (cuenta, mesaId) => this.emitCuentaGenerada(cuenta, mesaId),
        });
        this.menuDiaService.setGatewayEmitter({
            emitMenuDiaCreado: (menu) => this.emitMenuDiaCreado(menu),
            emitMenuItemActualizado: (item) => this.emitMenuItemActualizado(item),
            emitMenuItemEliminado: (itemId) => this.emitMenuItemEliminado(itemId),
            emitMenuPlatoAgregado: (item) => this.emitMenuPlatoAgregado(item),
            emitMenuDiaEliminado: () => this.emitMenuDiaEliminado(),
        });
    }
    handleUnirseCocina(client) {
        client.join('cocina');
        return { event: 'unido', data: 'cocina' };
    }
    handleUnirseMeseros(client) {
        client.join('meseros');
        return { event: 'unido', data: 'meseros' };
    }
    handleUnirseMesa(client, mesaId) {
        client.join(`mesa_${mesaId}`);
        return { event: 'unido', data: `mesa_${mesaId}` };
    }
    emitNuevaOrden(orden) {
        this.server.to('cocina').emit('nueva_orden', orden);
    }
    emitItemActualizado(item) {
        this.server.to('cocina').emit('orden_item_actualizado', item);
        this.server.to('meseros').emit('orden_item_actualizado', item);
        const mesaId = item.orden?.visita?.mesa?.id;
        if (mesaId) {
            this.server.to(`mesa_${mesaId}`).emit('orden_item_actualizado', item);
        }
    }
    emitOrdenLista(orden) {
        this.server.to('meseros').emit('orden_lista_para_entregar', orden);
    }
    emitCuentaGenerada(cuenta, mesaId) {
        this.server.to(`mesa_${mesaId}`).emit('cuenta_generada', cuenta);
        this.server.to('meseros').emit('cuenta_generada', cuenta);
    }
    emitPlatoAgotado(platoId, nombre) {
        this.server.emit('plato_agotado', { platoId, nombre });
    }
    emitMenuDiaCreado(menu) {
        this.server.emit('menu_dia_creado', menu);
    }
    emitMenuItemActualizado(item) {
        this.server.emit('menu_item_actualizado', item);
    }
    emitMenuItemEliminado(itemId) {
        this.server.emit('menu_item_eliminado', { itemId });
    }
    emitMenuPlatoAgregado(item) {
        this.server.emit('menu_plato_agregado', item);
    }
    emitMenuDiaEliminado() {
        this.server.emit('menu_dia_eliminado', {});
    }
};
exports.RestauranteGateway = RestauranteGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RestauranteGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('unirse_cocina'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RestauranteGateway.prototype, "handleUnirseCocina", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unirse_meseros'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RestauranteGateway.prototype, "handleUnirseMeseros", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unirse_mesa'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], RestauranteGateway.prototype, "handleUnirseMesa", null);
exports.RestauranteGateway = RestauranteGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*', credentials: false },
        namespace: '/',
    }),
    __metadata("design:paramtypes", [ordenes_service_1.OrdenesService,
        cuenta_service_1.CuentaService,
        menu_dia_service_1.MenuDiaService])
], RestauranteGateway);
//# sourceMappingURL=restaurante.gateway.js.map