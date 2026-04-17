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
exports.PlatosService = exports.CreatePlatoDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../common/entities");
class CreatePlatoDto {
    nombre;
    descripcion;
    precio;
    imagen_url;
    categoriaId;
    activo;
}
exports.CreatePlatoDto = CreatePlatoDto;
let PlatosService = class PlatosService {
    platoRepo;
    categoriaRepo;
    constructor(platoRepo, categoriaRepo) {
        this.platoRepo = platoRepo;
        this.categoriaRepo = categoriaRepo;
    }
    async findAll() {
        return this.platoRepo.find({ order: { nombre: 'ASC' } });
    }
    async findOne(id) {
        const plato = await this.platoRepo.findOne({ where: { id } });
        if (!plato)
            throw new common_1.NotFoundException(`Plato ${id} no encontrado`);
        return plato;
    }
    async create(dto) {
        const categoria = await this.categoriaRepo.findOne({
            where: { id: dto.categoriaId },
        });
        if (!categoria)
            throw new common_1.NotFoundException(`Categoría ${dto.categoriaId} no encontrada`);
        const plato = this.platoRepo.create({ ...dto, categoria });
        return this.platoRepo.save(plato);
    }
    async update(id, dto) {
        const plato = await this.findOne(id);
        if (dto.categoriaId) {
            const categoria = await this.categoriaRepo.findOne({
                where: { id: dto.categoriaId },
            });
            if (!categoria)
                throw new common_1.NotFoundException(`Categoría ${dto.categoriaId} no encontrada`);
            plato.categoria = categoria;
        }
        Object.assign(plato, dto);
        return this.platoRepo.save(plato);
    }
    async delete(id) {
        await this.findOne(id);
        await this.platoRepo.delete(id);
    }
    async findAllCategorias() {
        return this.categoriaRepo.find({ order: { nombre: 'ASC' } });
    }
    async createCategoria(nombre) {
        const cat = this.categoriaRepo.create({ nombre });
        return this.categoriaRepo.save(cat);
    }
    async updateCategoria(id, nombre) {
        const cat = await this.categoriaRepo.findOne({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException(`Categoría ${id} no encontrada`);
        cat.nombre = nombre;
        return this.categoriaRepo.save(cat);
    }
    async deleteCategoria(id) {
        const cat = await this.categoriaRepo.findOne({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException(`Categoría ${id} no encontrada`);
        await this.categoriaRepo.delete(id);
    }
};
exports.PlatosService = PlatosService;
exports.PlatosService = PlatosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Plato)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Categoria)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PlatosService);
//# sourceMappingURL=platos.service.js.map