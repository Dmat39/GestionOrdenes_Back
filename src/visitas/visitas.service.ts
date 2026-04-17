import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visita, Mesa } from '../common/entities';
import { EstadoMesa } from '../common/enums';
import { MesasService } from '../mesas/mesas.service';

@Injectable()
export class VisitasService {
  constructor(
    @InjectRepository(Visita)
    private readonly visitaRepo: Repository<Visita>,
    @InjectRepository(Mesa)
    private readonly mesaRepo: Repository<Mesa>,
    private readonly mesasService: MesasService,
  ) {}

  async getVisitaActivaPorMesa(mesaId: number): Promise<Visita | null> {
    return this.visitaRepo.findOne({
      where: { mesa: { id: mesaId }, activa: true },
      relations: ['mesa', 'ordenes', 'ordenes.items', 'ordenes.items.plato'],
    });
  }

  async crearVisita(mesaId: number): Promise<Visita> {
    const mesa = await this.mesasService.findOne(mesaId);

    // Reutilizar visita activa si existe
    const existing = await this.visitaRepo.findOne({
      where: { mesa: { id: mesaId }, activa: true },
    });
    if (existing) return existing;

    const visita = this.visitaRepo.create({ mesa, activa: true });
    const saved = await this.visitaRepo.save(visita);

    await this.mesasService.cambiarEstado(mesaId, EstadoMesa.OCUPADA);

    return saved;
  }

  async cerrarVisita(visitaId: number): Promise<Visita> {
    const visita = await this.visitaRepo.findOne({
      where: { id: visitaId },
      relations: ['mesa'],
    });
    if (!visita) throw new NotFoundException(`Visita ${visitaId} no encontrada`);

    visita.activa = false;
    await this.visitaRepo.save(visita);
    await this.mesasService.cambiarEstado(visita.mesa.id, EstadoMesa.LIBRE);

    return visita;
  }

  async findOne(id: number): Promise<Visita> {
    const visita = await this.visitaRepo.findOne({
      where: { id },
      relations: ['mesa', 'ordenes', 'ordenes.items', 'ordenes.items.plato'],
    });
    if (!visita) throw new NotFoundException(`Visita ${id} no encontrada`);
    return visita;
  }
}
