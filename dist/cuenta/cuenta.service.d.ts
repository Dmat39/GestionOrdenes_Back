import { Repository } from 'typeorm';
import { Cuenta, OrdenItem, Visita } from '../common/entities';
import { MetodoPago } from '../common/enums';
import { VisitasService } from '../visitas/visitas.service';
export declare class CuentaService {
    private readonly cuentaRepo;
    private readonly visitaRepo;
    private readonly itemRepo;
    private readonly visitasService;
    private gatewayEmitter?;
    setGatewayEmitter(emitter: typeof this.gatewayEmitter): void;
    constructor(cuentaRepo: Repository<Cuenta>, visitaRepo: Repository<Visita>, itemRepo: Repository<OrdenItem>, visitasService: VisitasService);
    generarCuenta(visitaId: number): Promise<Cuenta>;
    getCuentaByVisita(visitaId: number): Promise<Cuenta | null>;
    marcarPagado(cuentaId: number, metodoPago: MetodoPago): Promise<Cuenta>;
}
