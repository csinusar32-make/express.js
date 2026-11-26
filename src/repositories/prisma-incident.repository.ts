import { Incident as PrismaIncident, Prisma, PrismaClient } from '@prisma/client';
import { Paginated } from '../dtos/pagination.dto';
import { ICreateIncidentDTO } from '../dtos/incident.dto';
import { Incident, IncidentPriority, IncidentStatus } from '../models/incident.model';
import { traducirErrorPrisma } from '../errors/prisma-error.mapper';
import { LIMITE_POR_DEFECTO } from '../middlewares/validation';
import {
  IncidentFilters,
  IncidentRepository
} from './incident.repository';

const aPrioridad = (valor: string): IncidentPriority => {
  if (valor === 'BAJA' || valor === 'MEDIA' || valor === 'ALTA') return valor;
  throw new Error(`Prioridad de novedad no reconocida en la base de datos: ${valor}`);
};

const aEstado = (valor: string): IncidentStatus => {
  if (valor === 'PENDIENTE' || valor === 'EN_PROCESO' || valor === 'RESUELTA') {
    return valor;
  }
  throw new Error(`Estado de novedad no reconocido en la base de datos: ${valor}`);
};

const aDominio = (incidente: PrismaIncident): Incident => ({
  id: incidente.id.toString(),
  equipmentId: incidente.equipmentId,
  reportedBy: incidente.reportedBy,
  descripcion: incidente.descripcion,
  prioridad: aPrioridad(incidente.prioridad),
  estado: aEstado(incidente.estado),
  createdAt: incidente.createdAt.toISOString()
});

export class PrismaIncidentRepository implements IncidentRepository {
  constructor(private readonly database: PrismaClient) {}

  public async create(input: ICreateIncidentDTO): Promise<Incident> {
    try {
      const incidente = await this.database.incident.create({
        data: {
          equipmentId: input.equipmentId,
          reportedBy: input.reportedBy,
          descripcion: input.descripcion,
          prioridad: input.prioridad
        }
      });
      return aDominio(incidente);
    } catch (error) {
      throw traducirErrorPrisma(error, {
        P2003: 'El equipo o el reportante indicados no existen.',
        P2004: 'Los datos de la novedad incumplen una restricción de la base de datos.'
      });
    }
  }

  public async findAll(
    filters: IncidentFilters = {}
  ): Promise<Paginated<Incident>> {
    const where: Prisma.IncidentWhereInput = {};
    if (filters.estado !== undefined) where.estado = filters.estado;
    if (filters.prioridad !== undefined) where.prioridad = filters.prioridad;
    if (filters.equipmentId !== undefined) where.equipmentId = filters.equipmentId;

    const limite = filters.limit ?? (filters.page ? LIMITE_POR_DEFECTO : undefined);
    const [filas, total] = await Promise.all([
      this.database.incident.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: filters.page ? (filters.page - 1) * (limite ?? LIMITE_POR_DEFECTO) : undefined,
        take: limite
      }),
      this.database.incident.count({ where })
    ]);

    return { items: filas.map(aDominio), total };
  }

  public async findById(id: string): Promise<Incident | null> {
    const incidente = await this.database.incident.findUnique({
      where: { id: BigInt(id) }
    });
    return incidente ? aDominio(incidente) : null;
  }

  public async updateStatus(
    id: string,
    expectedStatus: IncidentStatus,
    status: IncidentStatus
  ): Promise<Incident | null> {
    const resultado = await this.database.incident.updateMany({
      where: { id: BigInt(id), estado: expectedStatus },
      data: { estado: status }
    });

    return resultado.count === 0 ? null : this.findById(id);
  }
}
