import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuDia, MenuDiaItem, Plato } from '../common/entities';

@Injectable()
export class MenuDiaService {
  constructor(
    @InjectRepository(MenuDia)
    private readonly menuRepo: Repository<MenuDia>,
    @InjectRepository(MenuDiaItem)
    private readonly itemRepo: Repository<MenuDiaItem>,
    @InjectRepository(Plato)
    private readonly platoRepo: Repository<Plato>,
  ) {}

  private getHoy(): string {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
  }

  async getMenuHoy(): Promise<MenuDia | null> {
    const hoy = this.getHoy();
    return this.menuRepo.findOne({
      where: { fecha: hoy },
      relations: ['items', 'items.plato', 'items.plato.categoria'],
    });
  }

  async getMenu(id: number): Promise<MenuDia> {
    const menu = await this.menuRepo.findOne({
      where: { id },
      relations: ['items', 'items.plato', 'items.plato.categoria'],
    });
    if (!menu) throw new NotFoundException(`Menu ${id} no encontrado`);
    return menu;
  }

  async crearMenuHoy(platoIds: number[]): Promise<MenuDia> {
    const hoy = this.getHoy();
    const existe = await this.menuRepo.findOne({ where: { fecha: hoy } });
    if (existe)
      throw new ConflictException('Ya existe un menú para hoy');

    const menu = this.menuRepo.create({ fecha: hoy });
    const saved = await this.menuRepo.save(menu);

    for (const platoId of platoIds) {
      const plato = await this.platoRepo.findOne({ where: { id: platoId } });
      if (plato) {
        const item = this.itemRepo.create({ menuDia: saved, plato, disponible: true });
        await this.itemRepo.save(item);
      }
    }

    return this.getMenu(saved.id);
  }

  async updateItem(
    itemId: number,
    data: { disponible?: boolean; stock?: number | null },
  ): Promise<MenuDiaItem> {
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
      relations: ['plato', 'plato.categoria'],
    });
    if (!item) throw new NotFoundException(`Item ${itemId} no encontrado`);
    Object.assign(item, data);
    return this.itemRepo.save(item);
  }

  async deleteMenuHoy(): Promise<void> {
    const hoy = this.getHoy();
    const menu = await this.menuRepo.findOne({ where: { fecha: hoy } });
    if (!menu) throw new NotFoundException('No hay menú para hoy');
    await this.itemRepo.delete({ menuDia: { id: menu.id } });
    await this.menuRepo.delete(menu.id);
  }

  async agregarPlato(menuId: number, platoId: number): Promise<MenuDiaItem> {
    const menu = await this.menuRepo.findOne({ where: { id: menuId } });
    if (!menu) throw new NotFoundException(`Menu ${menuId} no encontrado`);

    const plato = await this.platoRepo.findOne({
      where: { id: platoId },
      relations: ['categoria'],
    });
    if (!plato) throw new NotFoundException(`Plato ${platoId} no encontrado`);

    const item = this.itemRepo.create({ menuDia: menu, plato, disponible: true });
    const saved = await this.itemRepo.save(item);
    return this.itemRepo.findOne({
      where: { id: saved.id },
      relations: ['plato', 'plato.categoria'],
    }) as Promise<MenuDiaItem>;
  }

  async removeItem(itemId: number): Promise<void> {
    await this.itemRepo.delete(itemId);
  }
}
