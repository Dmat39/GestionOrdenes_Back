import { Repository } from 'typeorm';
import { Plato, Categoria } from '../common/entities';
export declare class CreatePlatoDto {
    nombre: string;
    descripcion?: string;
    precio: number;
    imagen_url?: string;
    categoriaId: number;
    activo?: boolean;
}
export declare class PlatosService {
    private readonly platoRepo;
    private readonly categoriaRepo;
    constructor(platoRepo: Repository<Plato>, categoriaRepo: Repository<Categoria>);
    findAll(): Promise<Plato[]>;
    findOne(id: number): Promise<Plato>;
    create(dto: CreatePlatoDto): Promise<Plato>;
    update(id: number, dto: Partial<CreatePlatoDto>): Promise<Plato>;
    delete(id: number): Promise<void>;
    findAllCategorias(): Promise<Categoria[]>;
    createCategoria(nombre: string): Promise<Categoria>;
    updateCategoria(id: number, nombre: string): Promise<Categoria>;
    deleteCategoria(id: number): Promise<void>;
}
