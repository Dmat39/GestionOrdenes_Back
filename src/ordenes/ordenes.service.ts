import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orden, OrdenItem, Plato, Visita } from '../common/entities';
import { EstadoItem, EstadoOrden } from '../common/enums';

export interface CreateOrdenItemDto {
  platoId: number;
  cantidad: number;
  notas?: string;
}

@Injectable()
export class OrdenesService {
  // Inyectado por el Gateway después de inicializar
  private gatewayEmitter?: {
    emitNuevaOrden: (orden: Orden) => void;
    emitItemActualizado: (item: OrdenItem) => void;
    emitOrdenLista: (orden: Orden) => void;
  };

  setGatewayEmitter(emitter: typeof this.gatewayEmitter) {
    this.gatewayEmitter = emitter;
  }

  constructor(
    @InjectRepository(Orden)
    private readonly ordenRepo: Repository<Orden>,
    @InjectRepository(OrdenItem)
    private readonly itemRepo: Repository<OrdenItem>,
    @InjectRepository(Visita)
    private readonly visitaRepo: Repository<Visita>,
    @InjectRepository(Plato)
    private readonly platoRepo: Repository<Plato>,
  ) {}

  async crearOrden(visitaId: number, items: CreateOrdenItemDto[]): Promise<Orden> {
    const visita = await this.visitaRepo.findOne({
      where: { id: visitaId, activa: true },
      relations: ['mesa'],
    });
    if (!visita) throw new NotFoundException(`Visita activa ${visitaId} no encontrada`);

    const orden = this.ordenRepo.create({ visita, estado: EstadoOrden.PENDIENTE });
    const savedOrden = await this.ordenRepo.save(orden);

    for (const i of items) {
      const plato = await this.platoRepo.findOne({ where: { id: i.platoId } });
      if (!plato) throw new NotFoundException(`Plato ${i.platoId} no encontrado`);
      const item = this.itemRepo.create({
        orden: savedOrden,
        plato,
        cantidad: i.cantidad,
        notas: i.notas,
        estado: EstadoItem.PENDIENTE,
      });
      await this.itemRepo.save(item);
    }

    const ordenCompleta = await this.findOne(savedOrden.id);
    this.gatewayEmitter?.emitNuevaOrden(ordenCompleta);
    return ordenCompleta;
  }

  async findOne(id: number): Promise<Orden> {
    const orden = await this.ordenRepo.findOne({
      where: { id },
      relations: ['items', 'items.plato', 'visita', 'visita.mesa'],
    });
    if (!orden) throw new NotFoundException(`Orden ${id} no encontrada`);
    return orden;
  }

  async findByVisita(visitaId: number): Promise<Orden[]> {
    return this.ordenRepo.find({
      where: { visita: { id: visitaId } },
      relations: ['items', 'items.plato', 'visita', 'visita.mesa'],
      order: { created_at: 'ASC' },
    });
  }

  async findParaCocina(): Promise<OrdenItem[]> {
    return this.itemRepo.find({
      where: [
        { estado: EstadoItem.PENDIENTE },
        { estado: EstadoItem.EN_PREPARACION },
      ],
      relations: ['plato', 'plato.categoria', 'orden', 'orden.visita', 'orden.visita.mesa'],
      order: { created_at: 'ASC' },
    });
  }

  async cambiarEstadoItem(itemId: number, estado: EstadoItem): Promise<OrdenItem> {
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
      relations: ['orden', 'orden.items', 'orden.visita', 'orden.visita.mesa', 'plato'],
    });
    if (!item) throw new NotFoundException(`Item ${itemId} no encontrado`);

    item.estado = estado;
    const saved = await this.itemRepo.save(item);

    this.gatewayEmitter?.emitItemActualizado(saved);

    // Verificar si todos los items de la orden están en LISTO
    const orden = await this.ordenRepo.findOne({
      where: { id: item.orden.id },
      relations: ['items', 'visita', 'visita.mesa'],
    });
    if (orden) {
      const todosListos = orden.items.every(
        (i) => i.estado === EstadoItem.LISTO || i.estado === EstadoItem.CANCELADO,
      );
      const algunoListo = orden.items.some((i) => i.estado === EstadoItem.LISTO);
      if (todosListos && algunoListo) {
        orden.estado = EstadoOrden.LISTO;
        await this.ordenRepo.save(orden);
        this.gatewayEmitter?.emitOrdenLista(orden);
      }
    }

    return saved;
  }

  async cancelarOrden(ordenId: number): Promise<Orden> {
    const orden = await this.findOne(ordenId);
    if (orden.estado !== EstadoOrden.PENDIENTE) {
      throw new BadRequestException('Solo se puede cancelar una orden en estado PENDIENTE');
    }
    orden.estado = EstadoOrden.CANCELADO;
    return this.ordenRepo.save(orden);
  }

  async marcarEntregado(ordenId: number): Promise<Orden> {
    const orden = await this.findOne(ordenId);
    orden.estado = EstadoOrden.ENTREGADO;
    for (const item of orden.items) {
      if (item.estado === EstadoItem.LISTO) {
        item.estado = EstadoItem.ENTREGADO;
        await this.itemRepo.save(item);
      }
    }
    return this.ordenRepo.save(orden);
  }
}
