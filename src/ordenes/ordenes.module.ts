import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orden, OrdenItem, Visita, Plato } from '../common/entities';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';
import { VisitasModule } from '../visitas/visitas.module';
import { AuditModule } from '../gerente/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orden, OrdenItem, Visita, Plato]),
    VisitasModule,
    AuditModule,
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService],
  exports: [OrdenesService],
})
export class OrdenesModule {}
