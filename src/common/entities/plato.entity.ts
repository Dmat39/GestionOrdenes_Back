import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categoria } from './categoria.entity';
import { MenuDiaItem } from './menu-dia-item.entity';

@Entity('platos')
export class Plato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ nullable: true })
  imagen_url: string;

  @ManyToOne(() => Categoria, (cat) => cat.platos, { eager: true })
  categoria: Categoria;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => MenuDiaItem, (item) => item.plato)
  menuItems: MenuDiaItem[];
}
