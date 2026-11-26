import { Prisma, PrismaClient, Room as PrismaRoom } from '@prisma/client';
import { Paginated } from '../dtos/pagination.dto';
import { ICreateRoomDTO, IUpdateRoomDTO } from '../dtos/room.dto';
import { Room, RoomStatus } from '../models/room.model';
import { traducirErrorPrisma } from '../errors/prisma-error.mapper';
import { LIMITE_POR_DEFECTO } from '../middlewares/validation';
import { RoomFilters, RoomRepository } from './room.repository';

const aEstado = (valor: string): RoomStatus => {
  if (valor === 'OPERATIVO' || valor === 'MANTENIMIENTO' || valor === 'INACTIVO') {
    return valor;
  }
  throw new Error(`Estado de ambiente no reconocido en la base de datos: ${valor}`);
};

const aDominio = (sala: PrismaRoom): Room => ({
  id: sala.id,
  nombre: sala.nombre,
  bloque: sala.bloque,
  capacidadPcs: sala.capacidadPcs,
  estado: aEstado(sala.estado)
});

export class PrismaRoomRepository implements RoomRepository {
  constructor(private readonly database: PrismaClient) {}

  public async create(input: ICreateRoomDTO): Promise<Room> {
    try {
      const sala = await this.database.room.create({
        data: {
          nombre: input.nombre,
          bloque: input.bloque,
          capacidadPcs: input.capacidadPcs,
          estado: input.estado ?? 'OPERATIVO'
        }
      });
      return aDominio(sala);
    } catch (error) {
      throw traducirErrorPrisma(error, {
        P2002: 'Ya existe un ambiente con ese nombre.'
      });
    }
  }

  public async findAll(filters: RoomFilters = {}): Promise<Paginated<Room>> {
    const where: Prisma.RoomWhereInput = {};
    if (filters.estado !== undefined) where.estado = filters.estado;
    if (filters.bloque !== undefined) where.bloque = filters.bloque;

    const limite = filters.limit ?? (filters.page ? LIMITE_POR_DEFECTO : undefined);
    const [filas, total] = await Promise.all([
      this.database.room.findMany({
        where,
        orderBy: { nombre: 'asc' },
        skip: filters.page ? (filters.page - 1) * (limite ?? LIMITE_POR_DEFECTO) : undefined,
        take: limite
      }),
      this.database.room.count({ where })
    ]);

    return { items: filas.map(aDominio), total };
  }

  public async findById(id: string): Promise<Room | null> {
    const sala = await this.database.room.findUnique({ where: { id } });
    return sala ? aDominio(sala) : null;
  }

  public async update(id: string, input: IUpdateRoomDTO): Promise<Room | null> {
    try {
      const sala = await this.database.room.update({
        where: { id },
        data: {
          nombre: input.nombre,
          bloque: input.bloque,
          capacidadPcs: input.capacidadPcs
        }
      });
      return aDominio(sala);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw traducirErrorPrisma(error, {
        P2002: 'Ya existe un ambiente con ese nombre.'
      });
    }
  }

  public async setStatus(id: string, estado: RoomStatus): Promise<Room | null> {
    try {
      const sala = await this.database.room.update({
        where: { id },
        data: { estado }
      });
      return aDominio(sala);
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
