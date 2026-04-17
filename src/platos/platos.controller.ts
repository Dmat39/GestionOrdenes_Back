import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PlatosService } from './platos.service';
import { AuditService } from '../gerente/audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../common/enums';

class CreatePlatoDtoValidated {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @IsNumber()
  categoriaId: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

class CreateCategoriaDto {
  @IsString()
  nombre: string;
}

@Controller('platos')
export class PlatosController {
  constructor(
    private readonly platosService: PlatosService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  findAll() {
    return this.platosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.platosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO, RolUsuario.GERENTE)
  async create(@Body() dto: CreatePlatoDtoValidated, @Request() req: any) {
    const result = await this.platosService.create(dto);
    this.auditService.log({
      usuarioId: req.user?.id,
      usuarioEmail: req.user?.email,
      accion: 'CREAR_PLATO',
      entidad: 'plato',
      entidadId: result.id,
      detalle: { nombre: dto.nombre, precio: dto.precio },
    });
    return result;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO, RolUsuario.GERENTE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreatePlatoDtoValidated>,
    @Request() req: any,
  ) {
    const result = await this.platosService.update(id, dto);
    this.auditService.log({
      usuarioId: req.user?.id,
      usuarioEmail: req.user?.email,
      accion: 'ACTUALIZAR_PLATO',
      entidad: 'plato',
      entidadId: id,
      detalle: dto as object,
    });
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO, RolUsuario.GERENTE)
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    await this.platosService.delete(id);
    this.auditService.log({
      usuarioId: req.user?.id,
      usuarioEmail: req.user?.email,
      accion: 'ELIMINAR_PLATO',
      entidad: 'plato',
      entidadId: id,
    });
  }

  // Categorías
  @Get('categorias/all')
  findAllCategorias() {
    return this.platosService.findAllCategorias();
  }

  @Post('categorias')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO, RolUsuario.GERENTE)
  async createCategoria(@Body() dto: CreateCategoriaDto, @Request() req: any) {
    const result = await this.platosService.createCategoria(dto.nombre);
    this.auditService.log({
      usuarioId: req.user?.id,
      usuarioEmail: req.user?.email,
      accion: 'CREAR_CATEGORIA',
      entidad: 'categoria',
      entidadId: result.id,
      detalle: { nombre: dto.nombre },
    });
    return result;
  }

  @Put('categorias/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO, RolUsuario.GERENTE)
  async updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCategoriaDto,
    @Request() req: any,
  ) {
    const result = await this.platosService.updateCategoria(id, dto.nombre);
    this.auditService.log({
      usuarioId: req.user?.id,
      usuarioEmail: req.user?.email,
      accion: 'ACTUALIZAR_CATEGORIA',
      entidad: 'categoria',
      entidadId: id,
      detalle: { nombre: dto.nombre },
    });
    return result;
  }

  @Delete('categorias/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO, RolUsuario.GERENTE)
  async deleteCategoria(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    await this.platosService.deleteCategoria(id);
    this.auditService.log({
      usuarioId: req.user?.id,
      usuarioEmail: req.user?.email,
      accion: 'ELIMINAR_CATEGORIA',
      entidad: 'categoria',
      entidadId: id,
    });
  }
}
