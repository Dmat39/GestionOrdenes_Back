import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IsEnum, IsInt, Min } from 'class-validator';
import { MesasService } from './mesas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EstadoMesa, RolUsuario } from '../common/enums';

class CreateMesaDto {
  @IsInt()
  @Min(1)
  numero: number;
}

class UpdateEstadoDto {
  @IsEnum(EstadoMesa)
  estado: EstadoMesa;
}

@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Get()
  findAll() {
    return this.mesasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  create(@Body() dto: CreateMesaDto) {
    return this.mesasService.create(dto.numero);
  }

  @Post(':id/qr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  regenerarQR(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.regenerarQR(id);
  }

  @Put(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoDto,
  ) {
    return this.mesasService.cambiarEstado(id, dto.estado);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.delete(id);
  }
}
