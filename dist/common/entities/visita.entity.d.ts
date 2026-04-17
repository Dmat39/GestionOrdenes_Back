import { Mesa } from './mesa.entity';
import { Orden } from './orden.entity';
import { Cuenta } from './cuenta.entity';
export declare class Visita {
    id: number;
    mesa: Mesa;
    activa: boolean;
    created_at: Date;
    ordenes: Orden[];
    cuentas: Cuenta[];
}
