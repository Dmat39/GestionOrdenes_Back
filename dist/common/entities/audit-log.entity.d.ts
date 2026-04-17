export declare class AuditLog {
    id: number;
    usuario_id: number;
    usuario_email: string;
    accion: string;
    entidad: string;
    entidad_id: number;
    detalle: object;
    created_at: Date;
}
