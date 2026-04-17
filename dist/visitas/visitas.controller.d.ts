import { VisitasService } from './visitas.service';
export declare class VisitasController {
    private readonly visitasService;
    constructor(visitasService: VisitasService);
    getVisitaActiva(mesaId: number): Promise<import("../common/entities").Visita | null>;
    crearVisita(mesaId: number): Promise<import("../common/entities").Visita>;
    cerrarVisita(id: number): Promise<import("../common/entities").Visita>;
    findOne(id: number): Promise<import("../common/entities").Visita>;
}
