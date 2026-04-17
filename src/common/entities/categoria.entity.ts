import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Plato } from './plato.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => Plato, (plato) => plato.categoria)
  platos: Plato[];
}
