import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrdenesService } from './ordenes.service';
import { AuditService } from '../gerente/audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EstadoItem, RolUsuario } from '../common/enums';

class OrdenItemDto {
  @IsInt()
  platoId: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsOptional()
  @IsString()
  notas?: string;
}

class CreateOrdenDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdenItemDto)
  items: OrdenItemDto[];
}

class UpdateItemEstadoDto {
  @IsEnum(EstadoItem)
  estado: EstadoItem;
}

@Controller('ordenes')
export class OrdenesController {
  constructor(
    private readonly ordenesService: OrdenesService,
    private readonly auditService: AuditService,
  ) {}

  @Post('visita/:visitaId')
  crearOrden(
    @Param('visitaId', ParseIntPipe) visitaId: number,
    @Body() dto: CreateOrdenDto,
  ) {
    return this.ordenesService.crearOrden(visitaId, dto.items);
  }

  @Get('visita/:visitaId')
  findByVisita(@Param('visitaId', ParseIntPipe) visitaId: number) {
    return this.ordenesService.findByVisita(visitaId);
  }

  @Get('cocina/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COCINERO, RolUsuario.MESERO)
  findParaCocina() {
    return this.ordenesService.findParaCocina();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenesService.findOne(id);
  }

  @Put('items/:itemId/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COCINERO, RolUsuario.MESERO)
  async cambiarEstadoItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateItemEstadoDto,
    @Request() req: any,
  ) {
    const result = await this.ordenesService.cambiarEstadoItem(itemId, dto.estado);
    this.auditService.log({
      usuarioId: req.user?.id,
      usuarioEmail: req.user?.email,
      accion: 'CAMBIAR_ESTADO_ITEM',
      entidad: 'orden_item',
      entidadId: itemId,
      detalle: { estado: dto.estado },
    });
    return result;
  }

  @Put(':id/cancelar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  async cancelarOrden(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const result = await this.ordenesService.cancelarOrden(id);
    this.auditService.log({
      usuarioId: req.user?.id,
      usuarioEmail: req.user?.email,
      accion: 'CANCELAR_ORDEN',
      entidad: 'orden',
      entidadId: id,
    });
    return result;
  }

  @Put(':id/entregar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  async marcarEntregado(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const result = await this.ordenesService.marcarEntregado(id);
    this.auditService.log({
      usuarioId: req.user?.id,
      usuarioEmail: req.user?.email,
      accion: 'ENTREGAR_ORDEN',
      entidad: 'orden',
      entidadId: id,
    });
    return result;
  }
}
