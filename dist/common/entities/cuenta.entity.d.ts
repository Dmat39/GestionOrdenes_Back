import { Visita } from './visita.entity';
import { EstadoPago, MetodoPago } from '../enums';
export declare class Cuenta {
    id: number;
    visita: Visita;
    total: number;
    metodo_pago: MetodoPago | null;
    estado_pago: EstadoPago;
    niubiz_session_key: string;
    niubiz_transaction_id: string;
    fecha_pago: Date;
    created_at: Date;
}
