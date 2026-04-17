import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Visita } from './visita.entity';
import { OrdenItem } from './orden-item.entity';
import { EstadoOrden } from '../enums';

@Entity('ordenes')
export class Orden {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Visita, (visita) => visita.ordenes)
  visita: Visita;

  @Column({ type: 'enum', enum: EstadoOrden, default: EstadoOrden.PENDIENTE })
  estado: EstadoOrden;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrdenItem, (item) => item.orden, { cascade: true })
  items: OrdenItem[];
}
