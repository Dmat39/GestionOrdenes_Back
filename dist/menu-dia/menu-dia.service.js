"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuDiaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../common/entities");
let MenuDiaService = class MenuDiaService {
    menuRepo;
    itemRepo;
    platoRepo;
    constructor(menuRepo, itemRepo, platoRepo) {
        this.menuRepo = menuRepo;
        this.itemRepo = itemRepo;
        this.platoRepo = platoRepo;
    }
    getHoy() {
        return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
    }
    async getMenuHoy() {
        const hoy = this.getHoy();
        return this.menuRepo.findOne({
            where: { fecha: hoy },
            relations: ['items', 'items.plato', 'items.plato.categoria'],
        });
    }
    async getMenu(id) {
        const menu = await this.menuRepo.findOne({
            where: { id },
            relations: ['items', 'items.plato', 'items.plato.categoria'],
        });
        if (!menu)
            throw new common_1.NotFoundException(`Menu ${id} no encontrado`);
        return menu;
    }
    async crearMenuHoy(platoIds) {
        const hoy = this.getHoy();
        const existe = await this.menuRepo.findOne({ where: { fecha: hoy } });
        if (existe)
            throw new common_1.ConflictException('Ya existe un menú para hoy');
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
    async updateItem(itemId, data) {
        const item = await this.itemRepo.findOne({
            where: { id: itemId },
            relations: ['plato', 'plato.categoria'],
        });
        if (!item)
            throw new common_1.NotFoundException(`Item ${itemId} no encontrado`);
        Object.assign(item, data);
        return this.itemRepo.save(item);
    }
    async deleteMenuHoy() {
        const hoy = this.getHoy();
        const menu = await this.menuRepo.findOne({ where: { fecha: hoy } });
        if (!menu)
            throw new common_1.NotFoundException('No hay menú para hoy');
        await this.itemRepo.delete({ menuDia: { id: menu.id } });
        await this.menuRepo.delete(menu.id);
    }
    async agregarPlato(menuId, platoId) {
        const menu = await this.menuRepo.findOne({ where: { id: menuId } });
        if (!menu)
            throw new common_1.NotFoundException(`Menu ${menuId} no encontrado`);
        const plato = await this.platoRepo.findOne({
            where: { id: platoId },
            relations: ['categoria'],
        });
        if (!plato)
            throw new common_1.NotFoundException(`Plato ${platoId} no encontrado`);
        const item = this.itemRepo.create({ menuDia: menu, plato, disponible: true });
        const saved = await this.itemRepo.save(item);
        return this.itemRepo.findOne({
            where: { id: saved.id },
            relations: ['plato', 'plato.categoria'],
        });
    }
    async removeItem(itemId) {
        await this.itemRepo.delete(itemId);
    }
};
exports.MenuDiaService = MenuDiaService;
exports.MenuDiaService = MenuDiaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.MenuDia)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.MenuDiaItem)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Plato)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MenuDiaService);
//# sourceMappingURL=menu-dia.service.js.map