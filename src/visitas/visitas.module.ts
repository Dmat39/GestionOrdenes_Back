import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visita, Mesa } from '../common/entities';
import { VisitasController } from './visitas.controller';
import { VisitasService } from './visitas.service';
import { MesasModule } from '../mesas/mesas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Visita, Mesa]), MesasModule],
  controllers: [VisitasController],
  providers: [VisitasService],
  exports: [VisitasService],
})
export class VisitasModule {}
