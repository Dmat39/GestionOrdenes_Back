import { MenuDiaService } from './menu-dia.service';
declare class CrearMenuDto {
    platoIds: number[];
}
declare class UpdateItemDto {
    disponible?: boolean;
    stock?: number | null;
    precio_oferta?: number | null;
    etiqueta?: string | null;
}
declare class AgregarPlatoDto {
    platoId: number;
}
export declare class MenuDiaController {
    private readonly menuDiaService;
    constructor(menuDiaService: MenuDiaService);
    getMenuHoy(): Promise<import("../common/entities").MenuDia | null>;
    deleteMenuHoy(): Promise<void>;
    getMenu(id: number): Promise<import("../common/entities").MenuDia>;
    crearMenuHoy(dto: CrearMenuDto): Promise<import("../common/entities").MenuDia>;
    updateItem(itemId: number, dto: UpdateItemDto): Promise<import("../common/entities").MenuDiaItem>;
    agregarPlato(menuId: number, dto: AgregarPlatoDto): Promise<import("../common/entities").MenuDiaItem>;
    removeItem(itemId: number): Promise<void>;
}
export {};
