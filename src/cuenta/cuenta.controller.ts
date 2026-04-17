import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IsEnum } from 'class-validator';
import { CuentaService } from './cuenta.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MetodoPago, RolUsuario } from '../common/enums';

class PagarDto {
  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;
}

@Controller('cuenta')
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) {}

  @Post('visita/:visitaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  generarCuenta(@Param('visitaId', ParseIntPipe) visitaId: number) {
    return this.cuentaService.generarCuenta(visitaId);
  }

  @Get('visita/:visitaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  getCuenta(@Param('visitaId', ParseIntPipe) visitaId: number) {
    return this.cuentaService.getCuentaByVisita(visitaId);
  }

  @Put(':id/pagar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  marcarPagado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PagarDto,
  ) {
    return this.cuentaService.marcarPagado(id, dto.metodoPago);
  }
}
