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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GerenteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const entities_1 = require("../common/entities");
let GerenteService = class GerenteService {
    cuentaRepo;
    ordenRepo;
    itemRepo;
    visitaRepo;
    usuarioRepo;
    auditRepo;
    constructor(cuentaRepo, ordenRepo, itemRepo, visitaRepo, usuarioRepo, auditRepo) {
        this.cuentaRepo = cuentaRepo;
        this.ordenRepo = ordenRepo;
        this.itemRepo = itemRepo;
        this.visitaRepo = visitaRepo;
        this.usuarioRepo = usuarioRepo;
        this.auditRepo = auditRepo;
    }
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
    async getVentasPorDia(desde, hasta) {
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
    async getVentasDetalle(desde, hasta) {
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
    async getRankingPlatos(desde, hasta) {
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
    async getAuditoria(params) {
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
    async getUsuarios() {
        const users = await this.usuarioRepo.find({ order: { id: 'ASC' } });
        return users.map(({ password: _, ...u }) => u);
    }
    async createUsuario(email, password, rol) {
        const existing = await this.usuarioRepo.findOne({ where: { email } });
        if (existing)
            throw new common_1.BadRequestException('El correo ya está registrado');
        const hashed = await bcrypt.hash(password, 10);
        const user = this.usuarioRepo.create({ email, password: hashed, rol, activo: true });
        const saved = await this.usuarioRepo.save(user);
        const { password: _, ...result } = saved;
        return result;
    }
    async toggleActivoUsuario(id) {
        const user = await this.usuarioRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Usuario ${id} no encontrado`);
        user.activo = !user.activo;
        const saved = await this.usuarioRepo.save(user);
        const { password: _, ...result } = saved;
        return result;
    }
    async updatePasswordUsuario(id, nuevaPassword) {
        const user = await this.usuarioRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Usuario ${id} no encontrado`);
        user.password = await bcrypt.hash(nuevaPassword, 10);
        await this.usuarioRepo.save(user);
        return { ok: true };
    }
};
exports.GerenteService = GerenteService;
exports.GerenteService = GerenteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Cuenta)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Orden)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.OrdenItem)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Visita)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.Usuario)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GerenteService);
//# sourceMappingURL=gerente.service.js.map