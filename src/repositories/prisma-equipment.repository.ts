import { Prisma, PrismaClient, Equipment as PrismaEquipment } from '@prisma/client';
import { Paginated } from '../dtos/pagination.dto';
import { ICreateEquipmentDTO, IUpdateEquipmentDTO } from '../dtos/equipment.dto';
import { Equipment, EquipmentStatus, EquipmentType } from '../models/equipment.model';
import { traducirErrorPrisma } from '../errors/prisma-error.mapper';
import { LIMITE_POR_DEFECTO } from '../middlewares/validation';
import {
  EquipmentFilters,
  EquipmentRepository
} from './equipment.repository';

const aTipo = (valor: string): EquipmentType => {
  const tipos: readonly string[] = [
    'COMPUTADOR', 'MOUSE', 'TECLADO', 'CARGADOR', 'TELEVISOR', 'CONTROL_TV'
  ];
  if (tipos.includes(valor)) return valor as EquipmentType;
  throw new Error(`Tipo de equipo no reconocido en la base de datos: ${valor}`);
};

const aEstado = (valor: string): EquipmentStatus => {
  if (valor === 'OPERATIVO' || valor === 'MANTENIMIENTO' || valor === 'FUERA_DE_SERVICIO') {
    return valor;
  }
  throw new Error(`Estado de equipo no reconocido en la base de datos: ${valor}`);
};

const aDominio = (equipo: PrismaEquipment): Equipment => ({
  id: equipo.id,
  placaSena: equipo.placaSena,
  codigoActivo: equipo.codigoActivo,
  tipo: aTipo(equipo.tipo),
  roomId: equipo.roomId,
  estado: aEstado(equipo.estado)
});

const mensajesUnicidad = {
  P2002: 'La placa SENA o el código de activo ya están registrados.'
};

export class PrismaEquipmentRepository implements EquipmentRepository {
  constructor(private readonly database: PrismaClient) {}

  public countComputersByRoom(roomId: string): Promise<number> {
    return this.database.equipment.count({
      where: { roomId, tipo: 'COMPUTADOR' }
    });
  }

  public async create(input: ICreateEquipmentDTO): Promise<Equipment> {
    try {
      const equipo = await this.database.equipment.create({
        data: {
          placaSena: input.placaSena,
          codigoActivo: input.codigoActivo,
          tipo: input.tipo,
          roomId: input.roomId,
          estado: input.estado ?? 'OPERATIVO'
        }
      });
      return aDominio(equipo);
    } catch (error) {
      throw traducirErrorPrisma(error, {
        ...mensajesUnicidad,
        P2003: 'El ambiente indicado no existe.'
      });
    }
  }

  public async findAll(filters: EquipmentFilters = {}): Promise<Paginated<Equipment>> {
    const where: Prisma.EquipmentWhereInput = {};
    if (filters.roomId !== undefined) where.roomId = filters.roomId;
    if (filters.estado !== undefined) where.estado = filters.estado;
    if (filters.tipo !== undefined) where.tipo = filters.tipo;

    const limite = filters.limit ?? (filters.page ? LIMITE_POR_DEFECTO : undefined);
    const [filas, total] = await Promise.all([
      this.database.equipment.findMany({
        where,
        orderBy: { placaSena: 'asc' },
        skip: filters.page ? (filters.page - 1) * (limite ?? LIMITE_POR_DEFECTO) : undefined,
        take: limite
      }),
      this.database.equipment.count({ where })
    ]);

    return { items: filas.map(aDominio), total };
  }

  public async findById(id: string): Promise<Equipment | null> {
    const equipo = await this.database.equipment.findUnique({ where: { id } });
    return equipo ? aDominio(equipo) : null;
  }

  public async update(id: string, input: IUpdateEquipmentDTO): Promise<Equipment | null> {
    try {
      const equipo = await this.database.equipment.update({
        where: { id },
        data: {
          placaSena: input.placaSena,
          codigoActivo: input.codigoActivo,
          tipo: input.tipo
        }
      });
      return aDominio(equipo);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw traducirErrorPrisma(error, mensajesUnicidad);
    }
  }

  public async move(id: string, roomId: string): Promise<Equipment | null> {
    try {
      const equipo = await this.database.equipment.update({
        where: { id },
        data: { roomId }
      });
      return aDominio(equipo);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }
      throw traducirErrorPrisma(error, {
        P2003: 'El ambiente destino no existe.'
      });
    }
  }

  public async setStatus(id: string, estado: EquipmentStatus): Promise<Equipment | null> {
    try {
      const equipo = await this.database.equipment.update({
        where: { id },
        data: { estado }
      });
      return aDominio(equipo);
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
