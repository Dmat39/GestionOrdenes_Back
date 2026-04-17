import { EstadoMesa } from '../enums';
import { Visita } from './visita.entity';
export declare class Mesa {
    id: number;
    numero: number;
    qr_code: string;
    estado: EstadoMesa;
    visitas: Visita[];
}
