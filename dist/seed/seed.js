"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const entities_1 = require("../common/entities");
const enums_1 = require("../common/enums");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usuarioRepo = app.get((0, typeorm_1.getRepositoryToken)(entities_1.Usuario));
    const mesaRepo = app.get((0, typeorm_1.getRepositoryToken)(entities_1.Mesa));
    const categoriaRepo = app.get((0, typeorm_1.getRepositoryToken)(entities_1.Categoria));
    const platoRepo = app.get((0, typeorm_1.getRepositoryToken)(entities_1.Plato));
    const menuRepo = app.get((0, typeorm_1.getRepositoryToken)(entities_1.MenuDia));
    const menuItemRepo = app.get((0, typeorm_1.getRepositoryToken)(entities_1.MenuDiaItem));
    const passwordHash = await bcrypt.hash('123456', 10);
    await usuarioRepo.upsert([
        { email: 'mesero@restaurante.com', password: passwordHash, rol: enums_1.RolUsuario.MESERO, activo: true },
        { email: 'cocinero@restaurante.com', password: passwordHash, rol: enums_1.RolUsuario.COCINERO, activo: true },
        { email: 'gerente@restaurante.com', password: passwordHash, rol: enums_1.RolUsuario.GERENTE, activo: true },
    ], ['email']);
    console.log('✓ Usuarios creados');
    for (let i = 1; i <= 10; i++) {
        const existe = await mesaRepo.findOne({ where: { numero: i } });
        if (!existe) {
            const mesa = mesaRepo.create({ numero: i });
            const saved = await mesaRepo.save(mesa);
            const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/mesa/${saved.id}`;
            const QRCode = await import('qrcode');
            saved.qr_code = await QRCode.toDataURL(url);
            await mesaRepo.save(saved);
        }
    }
    console.log('✓ Mesas creadas');
    const categoriasNombres = ['Entradas', 'Fondos', 'Bebidas', 'Postres'];
    const categorias = {};
    for (const nombre of categoriasNombres) {
        let cat = await categoriaRepo.findOne({ where: { nombre } });
        if (!cat)
            cat = await categoriaRepo.save(categoriaRepo.create({ nombre }));
        categorias[nombre] = cat;
    }
    console.log('✓ Categorías creadas');
    const platosData = [
        { nombre: 'Ceviche clásico', descripcion: 'Pescado en leche de tigre', precio: 28.00, categoria: 'Entradas' },
        { nombre: 'Tequeños de queso', descripcion: 'Crujientes tequeños con queso', precio: 18.00, categoria: 'Entradas' },
        { nombre: 'Causa limeña', descripcion: 'Papa amarilla con atún', precio: 22.00, categoria: 'Entradas' },
        { nombre: 'Lomo saltado', descripcion: 'Lomo con papa, tomate y cebolla', precio: 38.00, categoria: 'Fondos' },
        { nombre: 'Ají de gallina', descripcion: 'Pollo en salsa de ají amarillo', precio: 32.00, categoria: 'Fondos' },
        { nombre: 'Arroz con leche y mariscos', descripcion: 'Arroz cremoso con frutos del mar', precio: 42.00, categoria: 'Fondos' },
        { nombre: 'Seco de res', descripcion: 'Guiso de carne con cilantro', precio: 35.00, categoria: 'Fondos' },
        { nombre: 'Chicha morada', descripcion: 'Bebida de maíz morado', precio: 8.00, categoria: 'Bebidas' },
        { nombre: 'Limonada', descripcion: 'Jugo de limón con hielo', precio: 7.00, categoria: 'Bebidas' },
        { nombre: 'Inca Kola 500ml', descripcion: 'Gaseosa nacional', precio: 5.00, categoria: 'Bebidas' },
        { nombre: 'Arroz con leche', descripcion: 'Postre tradicional', precio: 12.00, categoria: 'Postres' },
        { nombre: 'Picarones', descripcion: 'Buñuelos con miel de chancaca', precio: 14.00, categoria: 'Postres' },
    ];
    const platos = [];
    for (const p of platosData) {
        let plato = await platoRepo.findOne({ where: { nombre: p.nombre } });
        if (!plato) {
            plato = await platoRepo.save(platoRepo.create({
                nombre: p.nombre,
                descripcion: p.descripcion,
                precio: p.precio,
                categoria: categorias[p.categoria],
                activo: true,
            }));
        }
        platos.push(plato);
    }
    console.log('✓ Platos creados');
    const hoy = new Date().toISOString().split('T')[0];
    let menu = await menuRepo.findOne({ where: { fecha: hoy } });
    if (!menu) {
        menu = await menuRepo.save(menuRepo.create({ fecha: hoy }));
        for (const plato of platos) {
            await menuItemRepo.save(menuItemRepo.create({ menuDia: menu, plato, disponible: true }));
        }
        console.log('✓ Menú del día creado');
    }
    else {
        console.log('✓ Menú del día ya existe');
    }
    await app.close();
    console.log('\n🎉 Seed completado exitosamente');
}
seed().catch((err) => {
    console.error('Error en seed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map