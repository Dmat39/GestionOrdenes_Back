import { MesasService } from './mesas.service';
import { EstadoMesa } from '../common/enums';
declare class CreateMesaDto {
    numero: number;
}
declare class UpdateEstadoDto {
    estado: EstadoMesa;
}
export declare class MesasController {
    private readonly mesasService;
    constructor(mesasService: MesasService);
    findAll(): Promise<import("../common/entities").Mesa[]>;
    findOne(id: number): Promise<import("../common/entities").Mesa>;
    create(dto: CreateMesaDto): Promise<import("../common/entities").Mesa>;
    regenerarQR(id: number): Promise<import("../common/entities").Mesa>;
    cambiarEstado(id: number, dto: UpdateEstadoDto): Promise<import("../common/entities").Mesa>;
    delete(id: number): Promise<void>;
}
export {};
