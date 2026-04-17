import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta, Visita, OrdenItem } from '../common/entities';
import { CuentaController } from './cuenta.controller';
import { CuentaService } from './cuenta.service';
import { VisitasModule } from '../visitas/visitas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cuenta, Visita, OrdenItem]),
    VisitasModule,
  ],
  controllers: [CuentaController],
  providers: [CuentaService],
  exports: [CuentaService],
})
export class CuentaModule {}
