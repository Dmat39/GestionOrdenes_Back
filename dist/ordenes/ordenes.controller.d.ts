import { OrdenesService } from './ordenes.service';
import { AuditService } from '../gerente/audit.service';
import { EstadoItem } from '../common/enums';
declare class OrdenItemDto {
    platoId: number;
    cantidad: number;
    notas?: string;
}
declare class CreateOrdenDto {
    items: OrdenItemDto[];
}
declare class UpdateItemEstadoDto {
    estado: EstadoItem;
}
export declare class OrdenesController {
    private readonly ordenesService;
    private readonly auditService;
    constructor(ordenesService: OrdenesService, auditService: AuditService);
    crearOrden(visitaId: number, dto: CreateOrdenDto): Promise<import("../common/entities").Orden>;
    findByVisita(visitaId: number): Promise<import("../common/entities").Orden[]>;
    findParaCocina(): Promise<import("../common/entities").OrdenItem[]>;
    findOne(id: number): Promise<import("../common/entities").Orden>;
    cambiarEstadoItem(itemId: number, dto: UpdateItemEstadoDto, req: any): Promise<import("../common/entities").OrdenItem>;
    cancelarOrden(id: number, req: any): Promise<import("../common/entities").Orden>;
    marcarEntregado(id: number, req: any): Promise<import("../common/entities").Orden>;
}
export {};
