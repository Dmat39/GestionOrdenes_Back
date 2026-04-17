import { Repository } from 'typeorm';
import { Mesa } from '../common/entities';
import { EstadoMesa } from '../common/enums';
export declare class MesasService {
    private readonly mesaRepo;
    constructor(mesaRepo: Repository<Mesa>);
    findAll(): Promise<Mesa[]>;
    findOne(id: number): Promise<Mesa>;
    create(numero: number): Promise<Mesa>;
    generarQR(id: number): Promise<string>;
    regenerarQR(id: number): Promise<Mesa>;
    cambiarEstado(id: number, estado: EstadoMesa): Promise<Mesa>;
    delete(id: number): Promise<void>;
}
