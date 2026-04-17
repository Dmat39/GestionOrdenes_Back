import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { GerenteService } from './gerente.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../common/enums';

class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;
}

class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  password: string;
}

@Controller('gerente')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.GERENTE)
export class GerenteController {
  constructor(private readonly gerenteService: GerenteService) {}

  // ── Dashboard ──────────────────────────────────────────────────────────────

  @Get('dashboard')
  getDashboard() {
    return this.gerenteService.getDashboardHoy();
  }

  // ── Ventas ─────────────────────────────────────────────────────────────────

  @Get('ventas/dia')
  getVentasDia(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.gerenteService.getVentasPorDia(desde, hasta);
  }

  @Get('ventas/detalle')
  getVentasDetalle(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.gerenteService.getVentasDetalle(desde, hasta);
  }

  // ── Platos ─────────────────────────────────────────────────────────────────

  @Get('platos/ranking')
  getRanking(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.gerenteService.getRankingPlatos(desde, hasta);
  }

  // ── Auditoría ──────────────────────────────────────────────────────────────

  @Get('auditoria')
  getAuditoria(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('accion') accion?: string,
    @Query('limit') limit?: string,
  ) {
    return this.gerenteService.getAuditoria({
      desde,
      hasta,
      usuarioId: usuarioId ? parseInt(usuarioId, 10) : undefined,
      accion,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  // ── Usuarios ───────────────────────────────────────────────────────────────

  @Get('usuarios')
  getUsuarios() {
    return this.gerenteService.getUsuarios();
  }

  @Post('usuarios')
  createUsuario(@Body() dto: CreateUsuarioDto) {
    return this.gerenteService.createUsuario(dto.email, dto.password, dto.rol);
  }

  @Patch('usuarios/:id/toggle')
  toggleActivo(@Param('id', ParseIntPipe) id: number) {
    return this.gerenteService.toggleActivoUsuario(id);
  }

  @Patch('usuarios/:id/password')
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.gerenteService.updatePasswordUsuario(id, dto.password);
  }
}
