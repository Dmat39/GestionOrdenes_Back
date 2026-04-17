import { Module } from '@nestjs/common';
import { RestauranteGateway } from './restaurante.gateway';
import { OrdenesModule } from '../ordenes/ordenes.module';
import { CuentaModule } from '../cuenta/cuenta.module';

@Module({
  imports: [OrdenesModule, CuentaModule],
  providers: [RestauranteGateway],
})
export class GatewayModule {}
