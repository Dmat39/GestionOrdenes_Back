import { Orden } from './orden.entity';
import { Plato } from './plato.entity';
import { EstadoItem } from '../enums';
export declare class OrdenItem {
    id: number;
    orden: Orden;
    plato: Plato;
    cantidad: number;
    notas: string;
    estado: EstadoItem;
    created_at: Date;
}
