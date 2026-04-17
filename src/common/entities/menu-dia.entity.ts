import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuDiaItem } from './menu-dia-item.entity';

@Entity('menu_dia')
export class MenuDia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', unique: true })
  fecha: string;

  @OneToMany(() => MenuDiaItem, (item) => item.menuDia, { cascade: true })
  items: MenuDiaItem[];
}
