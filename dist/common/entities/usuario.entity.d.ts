import { RolUsuario } from '../enums';
export declare class Usuario {
    id: number;
    email: string;
    password: string;
    rol: RolUsuario;
    activo: boolean;
    created_at: Date;
}
