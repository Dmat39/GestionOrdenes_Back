import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta, OrdenItem, Visita } from '../common/entities';
import { EstadoItem, EstadoMesa, EstadoPago, MetodoPago } from '../common/enums';
import { VisitasService } from '../visitas/visitas.service';

@Injectable()
export class CuentaService {
  private gatewayEmitter?: {
    emitCuentaGenerada: (cuenta: Cuenta, mesaId: number) => void;
  };

  setGatewayEmitter(emitter: typeof this.gatewayEmitter) {
    this.gatewayEmitter = emitter;
  }

  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepo: Repository<Cuenta>,
    @InjectRepository(Visita)
    private readonly visitaRepo: Repository<Visita>,
    @InjectRepository(OrdenItem)
    private readonly itemRepo: Repository<OrdenItem>,
    private readonly visitasService: VisitasService,
  ) {}

  async generarCuenta(visitaId: number): Promise<Cuenta> {
    const visita = await this.visitaRepo.findOne({
      where: { id: visitaId, activa: true },
      relations: ['mesa', 'ordenes', 'ordenes.items', 'ordenes.items.plato'],
    });
    if (!visita) throw new NotFoundException(`Visita activa ${visitaId} no encontrada`);

    // Consolidar todos los items de la visita
    const allItems = visita.ordenes.flatMap((o) => o.items).filter(
      (i) => i.estado !== EstadoItem.CANCELADO,
    );
    const total = allItems.reduce(
      (sum, i) => sum + Number(i.plato.precio) * i.cantidad,
      0,
    );

    // Actualizar estado de mesa
    visita.mesa.estado = EstadoMesa.CUENTA_PENDIENTE;
    await this.visitaRepo.manager.save(visita.mesa);

    const cuenta = this.cuentaRepo.create({ visita, total });
    const saved = await this.cuentaRepo.save(cuenta);

    this.gatewayEmitter?.emitCuentaGenerada(saved, visita.mesa.id);
    return saved;
  }

  async getCuentaByVisita(visitaId: number): Promise<Cuenta | null> {
    return this.cuentaRepo.findOne({
      where: { visita: { id: visitaId } },
      relations: ['visita', 'visita.mesa', 'visita.ordenes', 'visita.ordenes.items', 'visita.ordenes.items.plato'],
      order: { created_at: 'DESC' },
    });
  }

  async marcarPagado(cuentaId: number, metodoPago: MetodoPago): Promise<Cuenta> {
    const cuenta = await this.cuentaRepo.findOne({
      where: { id: cuentaId },
      relations: ['visita', 'visita.mesa'],
    });
    if (!cuenta) throw new NotFoundException(`Cuenta ${cuentaId} no encontrada`);
    if (cuenta.estado_pago === EstadoPago.PAGADO) {
      throw new BadRequestException('La cuenta ya está pagada');
    }

    cuenta.estado_pago = EstadoPago.PAGADO;
    cuenta.metodo_pago = metodoPago;
    cuenta.fecha_pago = new Date();
    await this.cuentaRepo.save(cuenta);

    // Cerrar visita y liberar mesa
    await this.visitasService.cerrarVisita(cuenta.visita.id);

    return cuenta;
  }
}
