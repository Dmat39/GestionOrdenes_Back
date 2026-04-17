import { MenuDia } from './menu-dia.entity';
import { Plato } from './plato.entity';
export declare class MenuDiaItem {
    id: number;
    menuDia: MenuDia;
    plato: Plato;
    disponible: boolean;
    stock: number | null;
    precio_oferta: number | null;
    etiqueta: string | null;
}
