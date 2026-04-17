import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrdenesService } from '../ordenes/ordenes.service';
import { CuentaService } from '../cuenta/cuenta.service';
import { Cuenta, Orden, OrdenItem } from '../common/entities';

@WebSocketGateway({
  cors: { origin: '*', credentials: false },
  namespace: '/',
})
export class RestauranteGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly ordenesService: OrdenesService,
    private readonly cuentaService: CuentaService,
  ) {}

  afterInit() {
    // Registrar emitter en los servicios
    this.ordenesService.setGatewayEmitter({
      emitNuevaOrden: (orden: Orden) => this.emitNuevaOrden(orden),
      emitItemActualizado: (item: OrdenItem) => this.emitItemActualizado(item),
      emitOrdenLista: (orden: Orden) => this.emitOrdenLista(orden),
    });

    this.cuentaService.setGatewayEmitter({
      emitCuentaGenerada: (cuenta: Cuenta, mesaId: number) =>
        this.emitCuentaGenerada(cuenta, mesaId),
    });
  }

  // --- Salas ---
  @SubscribeMessage('unirse_cocina')
  handleUnirseCocina(client: Socket) {
    client.join('cocina');
    return { event: 'unido', data: 'cocina' };
  }

  @SubscribeMessage('unirse_meseros')
  handleUnirseMeseros(client: Socket) {
    client.join('meseros');
    return { event: 'unido', data: 'meseros' };
  }

  @SubscribeMessage('unirse_mesa')
  handleUnirseMesa(client: Socket, mesaId: number) {
    client.join(`mesa_${mesaId}`);
    return { event: 'unido', data: `mesa_${mesaId}` };
  }

  // --- Emisores ---
  emitNuevaOrden(orden: Orden) {
    this.server.to('cocina').emit('nueva_orden', orden);
  }

  emitItemActualizado(item: OrdenItem) {
    this.server.to('cocina').emit('orden_item_actualizado', item);
    this.server.to('meseros').emit('orden_item_actualizado', item);

    // Notificar a la mesa del estado de su orden
    const mesaId = item.orden?.visita?.mesa?.id;
    if (mesaId) {
      this.server.to(`mesa_${mesaId}`).emit('orden_item_actualizado', item);
    }
  }

  emitOrdenLista(orden: Orden) {
    this.server.to('meseros').emit('orden_lista_para_entregar', orden);
  }

  emitCuentaGenerada(cuenta: Cuenta, mesaId: number) {
    this.server.to(`mesa_${mesaId}`).emit('cuenta_generada', cuenta);
    this.server.to('meseros').emit('cuenta_generada', cuenta);
  }

  emitPlatoAgotado(platoId: number, nombre: string) {
    this.server.emit('plato_agotado', { platoId, nombre });
  }
}
