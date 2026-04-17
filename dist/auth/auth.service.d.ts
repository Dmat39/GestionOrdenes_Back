import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../common/entities';
export declare class AuthService {
    private readonly usuarioRepo;
    private readonly jwtService;
    constructor(usuarioRepo: Repository<Usuario>, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        access_token: string;
        rol: import("../common/enums").RolUsuario;
        email: string;
    }>;
}
