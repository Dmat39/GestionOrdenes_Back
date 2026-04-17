import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  usuario_id!: number;

  @Column({ nullable: true })
  usuario_email!: string;

  @Column()
  accion!: string;

  @Column()
  entidad!: string;

  @Column({ nullable: true })
  entidad_id!: number;

  @Column({ type: 'jsonb', nullable: true })
  detalle!: object;

  @CreateDateColumn()
  created_at!: Date;
}
