import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plato, Categoria } from '../common/entities';

export class CreatePlatoDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  categoriaId: number;
  activo?: boolean;
}

@Injectable()
export class PlatosService {
  constructor(
    @InjectRepository(Plato)
    private readonly platoRepo: Repository<Plato>,
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Plato[]> {
    return this.platoRepo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Plato> {
    const plato = await this.platoRepo.findOne({ where: { id } });
    if (!plato) throw new NotFoundException(`Plato ${id} no encontrado`);
    return plato;
  }

  async create(dto: CreatePlatoDto): Promise<Plato> {
    const categoria = await this.categoriaRepo.findOne({
      where: { id: dto.categoriaId },
    });
    if (!categoria)
      throw new NotFoundException(`Categoría ${dto.categoriaId} no encontrada`);

    const plato = this.platoRepo.create({ ...dto, categoria });
    return this.platoRepo.save(plato);
  }

  async update(id: number, dto: Partial<CreatePlatoDto>): Promise<Plato> {
    const plato = await this.findOne(id);
    if (dto.categoriaId) {
      const categoria = await this.categoriaRepo.findOne({
        where: { id: dto.categoriaId },
      });
      if (!categoria)
        throw new NotFoundException(`Categoría ${dto.categoriaId} no encontrada`);
      plato.categoria = categoria;
    }
    Object.assign(plato, dto);
    return this.platoRepo.save(plato);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.platoRepo.delete(id);
  }

  // Categorías
  async findAllCategorias(): Promise<Categoria[]> {
    return this.categoriaRepo.find({ order: { nombre: 'ASC' } });
  }

  async createCategoria(nombre: string): Promise<Categoria> {
    const cat = this.categoriaRepo.create({ nombre });
    return this.categoriaRepo.save(cat);
  }

  async updateCategoria(id: number, nombre: string): Promise<Categoria> {
    const cat = await this.categoriaRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Categoría ${id} no encontrada`);
    cat.nombre = nombre;
    return this.categoriaRepo.save(cat);
  }

  async deleteCategoria(id: number): Promise<void> {
    const cat = await this.categoriaRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Categoría ${id} no encontrada`);
    await this.categoriaRepo.delete(id);
  }
}
