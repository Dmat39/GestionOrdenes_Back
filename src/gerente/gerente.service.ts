import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  AuditLog,
  Cuenta,
  Orden,
  OrdenItem,
  Usuario,
  Visita,
} from '../common/entities';
import { RolUsuario } from '../common/enums';

@Injectable()
export class GerenteService {
  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepo: Repository<Cuenta>,
    @InjectRepository(Orden)
    private readonly ordenRepo: Repository<Orden>,
    @InjectRepository(OrdenItem)
    private readonly itemRepo: Repository<OrdenItem>,
    @InjectRepository(Visita)
    private readonly visitaRepo: Repository<Visita>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  // ── Dashboard ────────────────────────────────────────────────────────────

  async getDashboardHoy() {
    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
    const fin = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59);

    const [ingresoRaw, ordenes, visitas, topPlatos] = await Promise.all([
      this.cuentaRepo
        .createQueryBuilder('c')
        .select('COALESCE(SUM(c.total), 0)', 'total')
        .where('c.estado_pago = :estado', { estado: 'PAGADO' })
        .andWhere('c.fecha_pago BETWEEN :inicio AND :fin', { inicio, fin })
        .getRawOne(),

      this.ordenRepo
        .createQueryBuilder('o')
        .where('o.created_at BETWEEN :inicio AND :fin', { inicio, fin })
        .getCount(),

      this.visitaRepo
        .createQueryBuilder('v')
        .where('v.created_at BETWEEN :inicio AND :fin', { inicio, fin })
        .getCount(),

      this.itemRepo
        .createQueryBuilder('oi')
        .leftJoin('oi.plato', 'p')
        .leftJoin('oi.orden', 'o')
        .select('p.nombre', 'nombre')
        .addSelect('SUM(oi.cantidad)', 'total')
        .where('oi.estado != :cancelado', { cancelado: 'CANCELADO' })
        .andWhere('o.created_at BETWEEN :inicio AND :fin', { inicio, fin })
        .groupBy('p.id')
        .addGroupBy('p.nombre')
        .orderBy('SUM(oi.cantidad)', 'DESC')
        .limit(5)
        .getRawMany(),
    ]);

    const ingresos = parseFloat(ingresoRaw?.total ?? '0');
    return {
      ingresos,
      ordenes,
      visitas,
      ticketPromedio: visitas > 0 ? +(ingresos / visitas).toFixed(2) : 0,
      topPlatos,
    };
  }

  // ── Ventas por rango ─────────────────────────────────────────────────────

  async getVentasPorDia(desde: string, hasta: string) {
    const desdeDate = new Date(desde);
    const hastaDate = new Date(hasta + 'T23:59:59');

    return this.cuentaRepo
      .createQueryBuilder('c')
      .select("DATE_TRUNC('day', c.fecha_pago)", 'dia')
      .addSelect('SUM(c.total)', 'total')
      .addSelect('COUNT(c.id)', 'cuentas')
      .where('c.estado_pago = :estado', { estado: 'PAGADO' })
      .andWhere('c.fecha_pago BETWEEN :desde AND :hasta', { desde: desdeDate, hasta: hastaDate })
      .groupBy("DATE_TRUNC('day', c.fecha_pago)")
      .orderBy("DATE_TRUNC('day', c.fecha_pago)", 'ASC')
      .getRawMany();
  }

  async getVentasDetalle(desde: string, hasta: string) {
    const desdeDate = new Date(desde);
    const hastaDate = new Date(hasta + 'T23:59:59');

    return this.cuentaRepo
      .createQueryBuilder('c')
      .leftJoin('c.visita', 'v')
      .leftJoin('v.mesa', 'm')
      .select('c.id', 'id')
      .addSelect('c.total', 'total')
      .addSelect('c.metodo_pago', 'metodo_pago')
      .addSelect('c.estado_pago', 'estado_pago')
      .addSelect('c.fecha_pago', 'fecha_pago')
      .addSelect('c.created_at', 'created_at')
      .addSelect('m.numero', 'mesa_numero')
      .where('c.created_at BETWEEN :desde AND :hasta', { desde: desdeDate, hasta: hastaDate })
      .orderBy('c.created_at', 'DESC')
      .getRawMany();
  }

  // ── Ranking de platos ────────────────────────────────────────────────────

  async getRankingPlatos(desde: string, hasta: string) {
    const desdeDate = new Date(desde);
    const hastaDate = new Date(hasta + 'T23:59:59');

    return this.itemRepo
      .createQueryBuilder('oi')
      .leftJoin('oi.plato', 'p')
      .leftJoin('p.categoria', 'cat')
      .leftJoin('oi.orden', 'o')
      .select('p.id', 'platoId')
      .addSelect('p.nombre', 'nombre')
      .addSelect('cat.nombre', 'categoria')
      .addSelect('SUM(oi.cantidad)', 'totalVendido')
      .addSelect('SUM(oi.cantidad * CAST(p.precio AS decimal))', 'totalIngreso')
      .where('oi.estado != :cancelado', { cancelado: 'CANCELADO' })
      .andWhere('o.created_at BETWEEN :desde AND :hasta', { desde: desdeDate, hasta: hastaDate })
      .groupBy('p.id')
      .addGroupBy('p.nombre')
      .addGroupBy('cat.nombre')
      .orderBy('SUM(oi.cantidad)', 'DESC')
      .getRawMany();
  }

  // ── Auditoría ────────────────────────────────────────────────────────────

  async getAuditoria(params: {
    desde?: string;
    hasta?: string;
    usuarioId?: number;
    accion?: string;
    limit?: number;
  }) {
    const qb = this.auditRepo
      .createQueryBuilder('al')
      .orderBy('al.created_at', 'DESC')
      .limit(params.limit ?? 200);

    if (params.desde) {
      qb.andWhere('al.created_at >= :desde', { desde: new Date(params.desde) });
    }
    if (params.hasta) {
      qb.andWhere('al.created_at <= :hasta', { hasta: new Date(params.hasta + 'T23:59:59') });
    }
    if (params.usuarioId) {
      qb.andWhere('al.usuario_id = :uid', { uid: params.usuarioId });
    }
    if (params.accion) {
      qb.andWhere('al.accion = :accion', { accion: params.accion });
    }

    return qb.getMany();
  }

  // ── Usuarios ─────────────────────────────────────────────────────────────

  async getUsuarios() {
    const users = await this.usuarioRepo.find({ order: { id: 'ASC' } });
    return users.map(({ password: _, ...u }) => u);
  }

  async createUsuario(email: string, password: string, rol: RolUsuario) {
    const existing = await this.usuarioRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('El correo ya está registrado');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.usuarioRepo.create({ email, password: hashed, rol, activo: true });
    const saved = await this.usuarioRepo.save(user);
    const { password: _, ...result } = saved;
    return result;
  }

  async toggleActivoUsuario(id: number) {
    const user = await this.usuarioRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    user.activo = !user.activo;
    const saved = await this.usuarioRepo.save(user);
    const { password: _, ...result } = saved;
    return result;
  }

  async updatePasswordUsuario(id: number, nuevaPassword: string) {
    const user = await this.usuarioRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    user.password = await bcrypt.hash(nuevaPassword, 10);
    await this.usuarioRepo.save(user);
    return { ok: true };
  }
}
