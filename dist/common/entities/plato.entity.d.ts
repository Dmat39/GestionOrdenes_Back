import { Categoria } from './categoria.entity';
import { MenuDiaItem } from './menu-dia-item.entity';
export declare class Plato {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_url: string;
    categoria: Categoria;
    activo: boolean;
    menuItems: MenuDiaItem[];
}
