import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuDia } from './menu-dia.entity';
import { Plato } from './plato.entity';

@Entity('menu_dia_items')
export class MenuDiaItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => MenuDia, (menu) => menu.items, { onDelete: 'CASCADE' })
  menuDia!: MenuDia;

  @ManyToOne(() => Plato, (plato) => plato.menuItems, { eager: true })
  plato!: Plato;

  @Column({ default: true })
  disponible!: boolean;

  @Column({ type: 'int', nullable: true })
  stock!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_oferta!: number | null;

  @Column({ type: 'varchar', nullable: true })
  etiqueta!: string | null;
}
