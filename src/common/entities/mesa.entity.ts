import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EstadoMesa } from '../enums';
import { Visita } from './visita.entity';

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: number;

  @Column({ nullable: true })
  qr_code: string;

  @Column({ type: 'enum', enum: EstadoMesa, default: EstadoMesa.LIBRE })
  estado: EstadoMesa;

  @OneToMany(() => Visita, (visita) => visita.mesa)
  visitas: Visita[];
}
