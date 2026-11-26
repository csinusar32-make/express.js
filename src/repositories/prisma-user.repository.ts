import { Prisma, PrismaClient, User as PrismaUser } from '@prisma/client';
import { Paginated } from '../dtos/pagination.dto';
import { ICreateUserDTO, IUpdateUserDTO } from '../dtos/user.dto';
import { User, UserRole } from '../models/user.model';
import { traducirErrorPrisma } from '../errors/prisma-error.mapper';
import { LIMITE_POR_DEFECTO } from '../middlewares/validation';
import { UserFilters, UserRepository } from './user.repository';

const aRol = (valor: string): UserRole => {
  if (valor === 'ADMIN' || valor === 'GUARDA' || valor === 'INSTRUCTOR') {
    return valor;
  }
  throw new Error(`Rol de usuario no reconocido en la base de datos: ${valor}`);
};

const aDominio = (usuario: PrismaUser): User => ({
  id: usuario.id,
  email: usuario.email,
  nombre: usuario.nombre,
  rol: aRol(usuario.rol),
  activo: usuario.activo,
  createdAt: usuario.createdAt.toISOString()
});

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly database: PrismaClient) {}

  public async create(input: ICreateUserDTO): Promise<User> {
    try {
      const usuario = await this.database.user.create({
        data: {
          email: input.email,
          nombre: input.nombre,
          rol: input.rol,
          activo: input.activo ?? true
        }
      });
      return aDominio(usuario);
    } catch (error) {
      throw traducirErrorPrisma(error, {
        P2002: 'Ya existe un usuario con ese correo electrónico.'
      });
    }
  }

  public async findAll(filters: UserFilters = {}): Promise<Paginated<User>> {
    const where: Prisma.UserWhereInput = {};
    if (filters.rol !== undefined) where.rol = filters.rol;
    if (filters.activo !== undefined) where.activo = filters.activo;

    const limite = filters.limit ?? (filters.page ? LIMITE_POR_DEFECTO : undefined);
    const [filas, total] = await Promise.all([
      this.database.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: filters.page ? (filters.page - 1) * (limite ?? LIMITE_POR_DEFECTO) : undefined,
        take: limite
      }),
      this.database.user.count({ where })
    ]);

    return { items: filas.map(aDominio), total };
  }

  public async findById(id: string): Promise<User | null> {
    const usuario = await this.database.user.findUnique({ where: { id } });
    return usuario ? aDominio(usuario) : null;
  }

  public async update(id: string, input: IUpdateUserDTO): Promise<User | null> {
    try {
      const usuario = await this.database.user.update({
        where: { id },
        data: {
          email: input.email,
          nombre: input.nombre,
          rol: input.rol
        }
      });
      return aDominio(usuario);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw traducirErrorPrisma(error, {
        P2002: 'Ya existe un usuario con ese correo electrónico.'
      });
    }
  }

  public async setActive(id: string, activo: boolean): Promise<User | null> {
    try {
      const usuario = await this.database.user.update({
        where: { id },
        data: { activo }
      });
      return aDominio(usuario);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw traducirErrorPrisma(error);
    }
  }
}
