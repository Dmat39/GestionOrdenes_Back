import { OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrdenesService } from '../ordenes/ordenes.service';
import { CuentaService } from '../cuenta/cuenta.service';
import { Cuenta, Orden, OrdenItem } from '../common/entities';
export declare class RestauranteGateway implements OnGatewayInit {
    private readonly ordenesService;
    private readonly cuentaService;
    server: Server;
    constructor(ordenesService: OrdenesService, cuentaService: CuentaService);
    afterInit(): void;
    handleUnirseCocina(client: Socket): {
        event: string;
        data: string;
    };
    handleUnirseMeseros(client: Socket): {
        event: string;
        data: string;
    };
    handleUnirseMesa(client: Socket, mesaId: number): {
        event: string;
        data: string;
    };
    emitNuevaOrden(orden: Orden): void;
    emitItemActualizado(item: OrdenItem): void;
    emitOrdenLista(orden: Orden): void;
    emitCuentaGenerada(cuenta: Cuenta, mesaId: number): void;
    emitPlatoAgotado(platoId: number, nombre: string): void;
}
