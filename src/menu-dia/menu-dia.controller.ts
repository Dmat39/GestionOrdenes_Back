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
import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min, ValidateIf } from 'class-validator';
import { MenuDiaService } from './menu-dia.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../common/enums';

class CrearMenuDto {
  @IsArray()
  @IsInt({ each: true })
  platoIds: number[];
}

class UpdateItemDto {
  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @ValidateIf((o) => o.stock !== null)
  @IsNumber()
  @Min(0)
  stock?: number | null;

  @IsOptional()
  @ValidateIf((o) => o.precio_oferta !== null)
  @IsNumber()
  @Min(0)
  precio_oferta?: number | null;

  @IsOptional()
  @ValidateIf((o) => o.etiqueta !== null)
  @IsString()
  etiqueta?: string | null;
}

class AgregarPlatoDto {
  @IsInt()
  platoId: number;
}

@Controller('menu-dia')
export class MenuDiaController {
  constructor(private readonly menuDiaService: MenuDiaService) {}

  @Get('hoy')
  getMenuHoy() {
    return this.menuDiaService.getMenuHoy();
  }

  @Delete('hoy')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  deleteMenuHoy() {
    return this.menuDiaService.deleteMenuHoy();
  }

  @Get(':id')
  getMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuDiaService.getMenu(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  crearMenuHoy(@Body() dto: CrearMenuDto) {
    return this.menuDiaService.crearMenuHoy(dto.platoIds);
  }

  @Put('items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  updateItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.menuDiaService.updateItem(itemId, dto);
  }

  @Post(':menuId/platos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  agregarPlato(
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() dto: AgregarPlatoDto,
  ) {
    return this.menuDiaService.agregarPlato(menuId, dto.platoId);
  }

  @Delete('items/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MESERO)
  removeItem(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.menuDiaService.removeItem(itemId);
  }
}
