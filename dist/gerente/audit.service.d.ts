import { Repository } from 'typeorm';
import { AuditLog } from '../common/entities';
export interface AuditParams {
    usuarioId?: number;
    usuarioEmail?: string;
    accion: string;
    entidad: string;
    entidadId?: number;
    detalle?: object;
}
export declare class AuditService {
    private readonly repo;
    constructor(repo: Repository<AuditLog>);
    log(params: AuditParams): Promise<void>;
}
