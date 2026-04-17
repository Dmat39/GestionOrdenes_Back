import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import { Mesa } from '../common/entities';
import { EstadoMesa } from '../common/enums';

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepo: Repository<Mesa>,
  ) {}

  async findAll(): Promise<Mesa[]> {
    return this.mesaRepo.find({ order: { numero: 'ASC' } });
  }

  async findOne(id: number): Promise<Mesa> {
    const mesa = await this.mesaRepo.findOne({ where: { id } });
    if (!mesa) throw new NotFoundException(`Mesa ${id} no encontrada`);
    return mesa;
  }

  async create(numero: number): Promise<Mesa> {
    const mesa = this.mesaRepo.create({ numero });
    const saved = await this.mesaRepo.save(mesa);
    saved.qr_code = await this.generarQR(saved.id);
    return this.mesaRepo.save(saved);
  }

  async generarQR(id: number): Promise<string> {
    const url = `${process.env.FRONTEND_URL}/mesa/${id}`;
    return QRCode.toDataURL(url);
  }

  async regenerarQR(id: number): Promise<Mesa> {
    const mesa = await this.findOne(id);
    mesa.qr_code = await this.generarQR(id);
    return this.mesaRepo.save(mesa);
  }

  async cambiarEstado(id: number, estado: EstadoMesa): Promise<Mesa> {
    const mesa = await this.findOne(id);
    mesa.estado = estado;
    return this.mesaRepo.save(mesa);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.mesaRepo.delete(id);
  }
}
