import { Repository } from 'typeorm';
import { AuditLog, Cuenta, Orden, OrdenItem, Usuario, Visita } from '../common/entities';
import { RolUsuario } from '../common/enums';
export declare class GerenteService {
    private readonly cuentaRepo;
    private readonly ordenRepo;
    private readonly itemRepo;
    private readonly visitaRepo;
    private readonly usuarioRepo;
    private readonly auditRepo;
    constructor(cuentaRepo: Repository<Cuenta>, ordenRepo: Repository<Orden>, itemRepo: Repository<OrdenItem>, visitaRepo: Repository<Visita>, usuarioRepo: Repository<Usuario>, auditRepo: Repository<AuditLog>);
    getDashboardHoy(): Promise<{
        ingresos: number;
        ordenes: number;
        visitas: number;
        ticketPromedio: number;
        topPlatos: any[];
    }>;
    getVentasPorDia(desde: string, hasta: string): Promise<any[]>;
    getVentasDetalle(desde: string, hasta: string): Promise<any[]>;
    getRankingPlatos(desde: string, hasta: string): Promise<any[]>;
    getAuditoria(params: {
        desde?: string;
        hasta?: string;
        usuarioId?: number;
        accion?: string;
        limit?: number;
    }): Promise<AuditLog[]>;
    getUsuarios(): Promise<{
        id: number;
        email: string;
        rol: RolUsuario;
        activo: boolean;
        created_at: Date;
    }[]>;
    createUsuario(email: string, password: string, rol: RolUsuario): Promise<{
        id: number;
        email: string;
        rol: RolUsuario;
        activo: boolean;
        created_at: Date;
    }>;
    toggleActivoUsuario(id: number): Promise<{
        id: number;
        email: string;
        rol: RolUsuario;
        activo: boolean;
        created_at: Date;
    }>;
    updatePasswordUsuario(id: number, nuevaPassword: string): Promise<{
        ok: boolean;
    }>;
}
