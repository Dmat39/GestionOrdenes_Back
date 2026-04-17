import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog, Cuenta, Orden, OrdenItem, Visita, Usuario } from '../common/entities';
import { GerenteController } from './gerente.controller';
import { GerenteService } from './gerente.service';
import { AuditModule } from './audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, Cuenta, Orden, OrdenItem, Visita, Usuario]),
    AuditModule,
  ],
  controllers: [GerenteController],
  providers: [GerenteService],
})
export class GerenteModule {}
