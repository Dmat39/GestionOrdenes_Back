import { GerenteService } from './gerente.service';
import { RolUsuario } from '../common/enums';
declare class CreateUsuarioDto {
    email: string;
    password: string;
    rol: RolUsuario;
}
declare class UpdatePasswordDto {
    password: string;
}
export declare class GerenteController {
    private readonly gerenteService;
    constructor(gerenteService: GerenteService);
    getDashboard(): Promise<{
        ingresos: number;
        ordenes: number;
        visitas: number;
        ticketPromedio: number;
        topPlatos: any[];
    }>;
    getVentasDia(desde: string, hasta: string): Promise<any[]>;
    getVentasDetalle(desde: string, hasta: string): Promise<any[]>;
    getRanking(desde: string, hasta: string): Promise<any[]>;
    getAuditoria(desde?: string, hasta?: string, usuarioId?: string, accion?: string, limit?: string): Promise<import("../common/entities").AuditLog[]>;
    getUsuarios(): Promise<{
        id: number;
        email: string;
        rol: RolUsuario;
        activo: boolean;
        created_at: Date;
    }[]>;
    createUsuario(dto: CreateUsuarioDto): Promise<{
        id: number;
        email: string;
        rol: RolUsuario;
        activo: boolean;
        created_at: Date;
    }>;
    toggleActivo(id: number): Promise<{
        id: number;
        email: string;
        rol: RolUsuario;
        activo: boolean;
        created_at: Date;
    }>;
    updatePassword(id: number, dto: UpdatePasswordDto): Promise<{
        ok: boolean;
    }>;
}
export {};
