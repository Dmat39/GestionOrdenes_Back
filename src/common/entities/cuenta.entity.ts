import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Visita } from './visita.entity';
import { EstadoPago, MetodoPago } from '../enums';

@Entity('cuentas')
export class Cuenta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Visita, (visita) => visita.cuentas)
  visita: Visita;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: MetodoPago, nullable: true })
  metodo_pago: MetodoPago | null;

  @Column({ type: 'enum', enum: EstadoPago, default: EstadoPago.PENDIENTE })
  estado_pago: EstadoPago;

  @Column({ nullable: true })
  niubiz_session_key: string;

  @Column({ nullable: true })
  niubiz_transaction_id: string;

  @Column({ nullable: true })
  fecha_pago: Date;

  @CreateDateColumn()
  created_at: Date;
}
