import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuDia, MenuDiaItem, Plato } from '../common/entities';
import { MenuDiaController } from './menu-dia.controller';
import { MenuDiaService } from './menu-dia.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuDia, MenuDiaItem, Plato])],
  controllers: [MenuDiaController],
  providers: [MenuDiaService],
  exports: [MenuDiaService],
})
export class MenuDiaModule {}
