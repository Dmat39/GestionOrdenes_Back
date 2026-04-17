import { Repository } from 'typeorm';
import { MenuDia, MenuDiaItem, Plato } from '../common/entities';
export declare class MenuDiaService {
    private readonly menuRepo;
    private readonly itemRepo;
    private readonly platoRepo;
    private gatewayEmitter?;
    setGatewayEmitter(emitter: typeof this.gatewayEmitter): void;
    constructor(menuRepo: Repository<MenuDia>, itemRepo: Repository<MenuDiaItem>, platoRepo: Repository<Plato>);
    private getHoy;
    getMenuHoy(): Promise<MenuDia | null>;
    getMenu(id: number): Promise<MenuDia>;
    crearMenuHoy(platoIds: number[]): Promise<MenuDia>;
    updateItem(itemId: number, data: {
        disponible?: boolean;
        stock?: number | null;
    }): Promise<MenuDiaItem>;
    deleteMenuHoy(): Promise<void>;
    agregarPlato(menuId: number, platoId: number): Promise<MenuDiaItem>;
    removeItem(itemId: number): Promise<void>;
}
