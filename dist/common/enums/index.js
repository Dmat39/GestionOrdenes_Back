"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolUsuario = exports.EstadoPago = exports.MetodoPago = exports.EstadoItem = exports.EstadoOrden = exports.EstadoMesa = void 0;
var EstadoMesa;
(function (EstadoMesa) {
    EstadoMesa["LIBRE"] = "LIBRE";
    EstadoMesa["OCUPADA"] = "OCUPADA";
    EstadoMesa["CUENTA_PENDIENTE"] = "CUENTA_PENDIENTE";
})(EstadoMesa || (exports.EstadoMesa = EstadoMesa = {}));
var EstadoOrden;
(function (EstadoOrden) {
    EstadoOrden["PENDIENTE"] = "PENDIENTE";
    EstadoOrden["EN_PREPARACION"] = "EN_PREPARACION";
    EstadoOrden["LISTO"] = "LISTO";
    EstadoOrden["ENTREGADO"] = "ENTREGADO";
    EstadoOrden["CANCELADO"] = "CANCELADO";
})(EstadoOrden || (exports.EstadoOrden = EstadoOrden = {}));
var EstadoItem;
(function (EstadoItem) {
    EstadoItem["PENDIENTE"] = "PENDIENTE";
    EstadoItem["EN_PREPARACION"] = "EN_PREPARACION";
    EstadoItem["LISTO"] = "LISTO";
    EstadoItem["ENTREGADO"] = "ENTREGADO";
    EstadoItem["CANCELADO"] = "CANCELADO";
})(EstadoItem || (exports.EstadoItem = EstadoItem = {}));
var MetodoPago;
(function (MetodoPago) {
    MetodoPago["EFECTIVO"] = "EFECTIVO";
    MetodoPago["TARJETA"] = "TARJETA";
})(MetodoPago || (exports.MetodoPago = MetodoPago = {}));
var EstadoPago;
(function (EstadoPago) {
    EstadoPago["PENDIENTE"] = "PENDIENTE";
    EstadoPago["PAGADO"] = "PAGADO";
})(EstadoPago || (exports.EstadoPago = EstadoPago = {}));
var RolUsuario;
(function (RolUsuario) {
    RolUsuario["MESERO"] = "MESERO";
    RolUsuario["COCINERO"] = "COCINERO";
    RolUsuario["GERENTE"] = "GERENTE";
})(RolUsuario || (exports.RolUsuario = RolUsuario = {}));
//# sourceMappingURL=index.js.map