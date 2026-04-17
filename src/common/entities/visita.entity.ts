import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mesa } from './mesa.entity';
import { Orden } from './orden.entity';
import { Cuenta } from './cuenta.entity';

@Entity('visitas')
export class Visita {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Mesa, (mesa) => mesa.visitas)
  mesa: Mesa;

  @Column({ default: true })
  activa: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Orden, (orden) => orden.visita)
  ordenes: Orden[];

  @OneToMany(() => Cuenta, (cuenta) => cuenta.visita)
  cuentas: Cuenta[];
}
