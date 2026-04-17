import { Module } from '@nestjs/common';
import { RestauranteGateway } from './restaurante.gateway';
import { OrdenesModule } from '../ordenes/ordenes.module';
import { CuentaModule } from '../cuenta/cuenta.module';
import { MenuDiaModule } from '../menu-dia/menu-dia.module';

@Module({
  imports: [OrdenesModule, CuentaModule, MenuDiaModule],
  providers: [RestauranteGateway],
})
export class GatewayModule {}
