import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plato, Categoria } from '../common/entities';
import { PlatosController } from './platos.controller';
import { PlatosService } from './platos.service';
import { AuditModule } from '../gerente/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plato, Categoria]), AuditModule],
  controllers: [PlatosController],
  providers: [PlatosService],
  exports: [PlatosService],
})
export class PlatosModule {}
