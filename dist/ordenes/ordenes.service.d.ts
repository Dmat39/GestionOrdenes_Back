import { Repository } from 'typeorm';
import { Orden, OrdenItem, Plato, Visita } from '../common/entities';
import { EstadoItem } from '../common/enums';
export interface CreateOrdenItemDto {
    platoId: number;
    cantidad: number;
    notas?: string;
}
export declare class OrdenesService {
    private readonly ordenRepo;
    private readonly itemRepo;
    private readonly visitaRepo;
    private readonly platoRepo;
    private gatewayEmitter?;
    setGatewayEmitter(emitter: typeof this.gatewayEmitter): void;
    constructor(ordenRepo: Repository<Orden>, itemRepo: Repository<OrdenItem>, visitaRepo: Repository<Visita>, platoRepo: Repository<Plato>);
    crearOrden(visitaId: number, items: CreateOrdenItemDto[]): Promise<Orden>;
    findOne(id: number): Promise<Orden>;
    findByVisita(visitaId: number): Promise<Orden[]>;
    findParaCocina(): Promise<OrdenItem[]>;
    cambiarEstadoItem(itemId: number, estado: EstadoItem): Promise<OrdenItem>;
    cancelarOrden(ordenId: number): Promise<Orden>;
    marcarEntregado(ordenId: number): Promise<Orden>;
}
