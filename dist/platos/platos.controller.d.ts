import { PlatosService } from './platos.service';
import { AuditService } from '../gerente/audit.service';
declare class CreatePlatoDtoValidated {
    nombre: string;
    descripcion?: string;
    precio: number;
    imagen_url?: string;
    categoriaId: number;
    activo?: boolean;
}
declare class CreateCategoriaDto {
    nombre: string;
}
export declare class PlatosController {
    private readonly platosService;
    private readonly auditService;
    constructor(platosService: PlatosService, auditService: AuditService);
    findAll(): Promise<import("../common/entities").Plato[]>;
    findOne(id: number): Promise<import("../common/entities").Plato>;
    create(dto: CreatePlatoDtoValidated, req: any): Promise<import("../common/entities").Plato>;
    update(id: number, dto: Partial<CreatePlatoDtoValidated>, req: any): Promise<import("../common/entities").Plato>;
    delete(id: number, req: any): Promise<void>;
    findAllCategorias(): Promise<import("../common/entities").Categoria[]>;
    createCategoria(dto: CreateCategoriaDto, req: any): Promise<import("../common/entities").Categoria>;
    updateCategoria(id: number, dto: CreateCategoriaDto, req: any): Promise<import("../common/entities").Categoria>;
    deleteCategoria(id: number, req: any): Promise<void>;
}
export {};
