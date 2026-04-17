import { Visita } from './visita.entity';
import { OrdenItem } from './orden-item.entity';
import { EstadoOrden } from '../enums';
export declare class Orden {
    id: number;
    visita: Visita;
    estado: EstadoOrden;
    created_at: Date;
    items: OrdenItem[];
}
