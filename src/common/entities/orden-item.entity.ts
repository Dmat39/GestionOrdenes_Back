import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orden } from './orden.entity';
import { Plato } from './plato.entity';
import { EstadoItem } from '../enums';

@Entity('orden_items')
export class OrdenItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Orden, (orden) => orden.items, { onDelete: 'CASCADE' })
  orden: Orden;

  @ManyToOne(() => Plato, { eager: true })
  plato: Plato;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ nullable: true })
  notas: string;

  @Column({ type: 'enum', enum: EstadoItem, default: EstadoItem.PENDIENTE })
  estado: EstadoItem;

  @CreateDateColumn()
  created_at: Date;
}
