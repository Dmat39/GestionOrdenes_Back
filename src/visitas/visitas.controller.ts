import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { VisitasService } from './visitas.service';

@Controller('visitas')
export class VisitasController {
  constructor(private readonly visitasService: VisitasService) {}

  @Get('mesa/:mesaId/activa')
  getVisitaActiva(@Param('mesaId', ParseIntPipe) mesaId: number) {
    return this.visitasService.getVisitaActivaPorMesa(mesaId);
  }

  @Post('mesa/:mesaId')
  crearVisita(@Param('mesaId', ParseIntPipe) mesaId: number) {
    return this.visitasService.crearVisita(mesaId);
  }

  @Post(':id/cerrar')
  cerrarVisita(@Param('id', ParseIntPipe) id: number) {
    return this.visitasService.cerrarVisita(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.visitasService.findOne(id);
  }
}
