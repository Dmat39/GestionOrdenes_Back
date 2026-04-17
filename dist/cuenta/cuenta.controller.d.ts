import { CuentaService } from './cuenta.service';
import { MetodoPago } from '../common/enums';
declare class PagarDto {
    metodoPago: MetodoPago;
}
export declare class CuentaController {
    private readonly cuentaService;
    constructor(cuentaService: CuentaService);
    generarCuenta(visitaId: number): Promise<import("../common/entities").Cuenta>;
    getCuenta(visitaId: number): Promise<import("../common/entities").Cuenta | null>;
    marcarPagado(id: number, dto: PagarDto): Promise<import("../common/entities").Cuenta>;
}
export {};
