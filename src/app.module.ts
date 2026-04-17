import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Usuario,
  Mesa,
  Categoria,
  Plato,
  MenuDia,
  MenuDiaItem,
  Visita,
  Orden,
  OrdenItem,
  Cuenta,
  AuditLog,
} from './common/entities';
import { AuthModule } from './auth/auth.module';
import { MesasModule } from './mesas/mesas.module';
import { PlatosModule } from './platos/platos.module';
import { MenuDiaModule } from './menu-dia/menu-dia.module';
import { VisitasModule } from './visitas/visitas.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { CuentaModule } from './cuenta/cuenta.module';
import { GatewayModule } from './gateway/gateway.module';
import { GerenteModule } from './gerente/gerente.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [
          Usuario, Mesa, Categoria, Plato,
          MenuDia, MenuDiaItem, Visita,
          Orden, OrdenItem, Cuenta, AuditLog,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    MesasModule,
    PlatosModule,
    MenuDiaModule,
    VisitasModule,
    OrdenesModule,
    CuentaModule,
    GatewayModule,
    GerenteModule,
  ],
})
export class AppModule {}
