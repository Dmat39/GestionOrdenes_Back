import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../common/entities';

export interface AuditParams {
  usuarioId?: number;
  usuarioEmail?: string;
  accion: string;
  entidad: string;
  entidadId?: number;
  detalle?: object;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(params: AuditParams): Promise<void> {
    try {
      const entry = this.repo.create({
        usuario_id: params.usuarioId,
        usuario_email: params.usuarioEmail,
        accion: params.accion,
        entidad: params.entidad,
        entidad_id: params.entidadId,
        detalle: params.detalle,
      });
      await this.repo.save(entry);
    } catch {
      // Nunca romper el flujo principal por un error de auditoría
    }
  }
}
