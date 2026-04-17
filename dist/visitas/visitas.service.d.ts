import { Repository } from 'typeorm';
import { Visita, Mesa } from '../common/entities';
import { MesasService } from '../mesas/mesas.service';
export declare class VisitasService {
    private readonly visitaRepo;
    private readonly mesaRepo;
    private readonly mesasService;
    constructor(visitaRepo: Repository<Visita>, mesaRepo: Repository<Mesa>, mesasService: MesasService);
    getVisitaActivaPorMesa(mesaId: number): Promise<Visita | null>;
    crearVisita(mesaId: number): Promise<Visita>;
    cerrarVisita(visitaId: number): Promise<Visita>;
    findOne(id: number): Promise<Visita>;
}
