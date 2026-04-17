import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  Usuario,
  Mesa,
  Categoria,
  Plato,
  MenuDia,
  MenuDiaItem,
} from '../common/entities';
import { RolUsuario } from '../common/enums';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usuarioRepo = app.get(getRepositoryToken(Usuario));
  const mesaRepo = app.get(getRepositoryToken(Mesa));
  const categoriaRepo = app.get(getRepositoryToken(Categoria));
  const platoRepo = app.get(getRepositoryToken(Plato));
  const menuRepo = app.get(getRepositoryToken(MenuDia));
  const menuItemRepo = app.get(getRepositoryToken(MenuDiaItem));

  // Usuarios
  const passwordHash = await bcrypt.hash('123456', 10);
  await usuarioRepo.upsert(
    [
      { email: 'mesero@restaurante.com', password: passwordHash, rol: RolUsuario.MESERO, activo: true },
      { email: 'cocinero@restaurante.com', password: passwordHash, rol: RolUsuario.COCINERO, activo: true },
      { email: 'gerente@restaurante.com', password: passwordHash, rol: RolUsuario.GERENTE, activo: true },
    ],
    ['email'],
  );
  console.log('✓ Usuarios creados');

  // Mesas
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

  // Categorías
  const categoriasNombres = ['Entradas', 'Fondos', 'Bebidas', 'Postres'];
  const categorias: Record<string, Categoria> = {};
  for (const nombre of categoriasNombres) {
    let cat = await categoriaRepo.findOne({ where: { nombre } });
    if (!cat) cat = await categoriaRepo.save(categoriaRepo.create({ nombre }));
    categorias[nombre] = cat;
  }
  console.log('✓ Categorías creadas');

  // Platos (12 distribuidos)
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

  const platos: Plato[] = [];
  for (const p of platosData) {
    let plato = await platoRepo.findOne({ where: { nombre: p.nombre } });
    if (!plato) {
      plato = await platoRepo.save(
        platoRepo.create({
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          categoria: categorias[p.categoria],
          activo: true,
        }),
      );
    }
    platos.push(plato);
  }
  console.log('✓ Platos creados');

  // MenuDia de hoy
  const hoy = new Date().toISOString().split('T')[0];
  let menu = await menuRepo.findOne({ where: { fecha: hoy } });
  if (!menu) {
    menu = await menuRepo.save(menuRepo.create({ fecha: hoy }));
    for (const plato of platos) {
      await menuItemRepo.save(
        menuItemRepo.create({ menuDia: menu, plato, disponible: true }),
      );
    }
    console.log('✓ Menú del día creado');
  } else {
    console.log('✓ Menú del día ya existe');
  }

  await app.close();
  console.log('\n🎉 Seed completado exitosamente');
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
