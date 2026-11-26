import {
  ConteoPorEstado,
  ConteoPorPrioridad,
  DashboardEquipment,
  DashboardIncident,
  DashboardIncidents,
  DashboardLoan,
  DashboardRoom,
  DashboardRoomDetail,
  DashboardSummary
} from '../dtos/dashboard.dto';
import { EquipmentStatus, EquipmentType } from '../dtos/equipment.dto';
import {
  IncidentPriority,
  IncidentStatus,
  esEstadoIncident,
  esPrioridadIncident
} from '../dtos/incident.dto';
import { LoanStatus, esEstadoLoan } from '../dtos/loan.dto';
import { RoomStatus, esEstadoRoom } from '../dtos/room.dto';
import { PrismaClient } from '@prisma/client';

export interface DashboardRepository {
  summary(): Promise<DashboardSummary>;
  roomDetail(roomId: string): Promise<DashboardRoomDetail | null>;
  openIncidents(): Promise<DashboardIncidents>;
}

const aEstadoRoom = (valor: string): RoomStatus => {
  if (!esEstadoRoom(valor)) throw new Error(`Estado de ambiente desconocido: ${valor}`);
  return valor;
};

const aEstadoEquipo = (valor: string): EquipmentStatus => {
  if (valor === 'OPERATIVO' || valor === 'MANTENIMIENTO' || valor === 'FUERA_DE_SERVICIO') {
    return valor;
  }
  throw new Error(`Estado de equipo desconocido: ${valor}`);
};

const aTipoEquipo = (valor: string): EquipmentType => {
  const tipos: readonly string[] = [
    'COMPUTADOR', 'MOUSE', 'TECLADO', 'CARGADOR', 'TELEVISOR', 'CONTROL_TV'
  ];
  if (!tipos.includes(valor)) throw new Error(`Tipo de equipo desconocido: ${valor}`);
  return valor as EquipmentType;
};

const aEstadoPrestamo = (valor: string): LoanStatus => {
  if (!esEstadoLoan(valor)) throw new Error(`Estado de préstamo desconocido: ${valor}`);
  return valor;
};

const aEstadoNovedad = (valor: string): IncidentStatus => {
  if (!esEstadoIncident(valor)) throw new Error(`Estado de novedad desconocido: ${valor}`);
  return valor;
};

const aPrioridad = (valor: string): IncidentPriority => {
  if (!esPrioridadIncident(valor)) throw new Error(`Prioridad desconocida: ${valor}`);
  return valor;
};

/**
 * Adaptador Prisma del dashboard. No hay tabla propia: todo se calcula
 * con count/groupBy/findMany sobre las tablas existentes.
 */
export class PrismaDashboardRepository implements DashboardRepository {
  constructor(private readonly database: PrismaClient) {}

  public async summary(): Promise<DashboardSummary> {
    const estadosAbiertos: IncidentStatus[] = ['PENDIENTE', 'EN_PROCESO'];

    const [
      usuariosActivos,
      ambientes,
      equipos,
      prestamos,
      novedadesEstado,
      novedadesPrioridad
    ] = await Promise.all([
      this.database.user.count({ where: { activo: true } }),
      this.database.room.groupBy({ by: ['estado'], _count: { _all: true } }),
      this.database.equipment.groupBy({ by: ['estado'], _count: { _all: true } }),
      this.database.loan.groupBy({ by: ['estado'], _count: { _all: true } }),
      this.database.incident.groupBy({ by: ['estado'], _count: { _all: true } }),
      this.database.incident.groupBy({
        by: ['prioridad'],
        where: { estado: { in: estadosAbiertos } },
        _count: { _all: true }
      })
    ]);

    const ambientesPorEstado: Array<ConteoPorEstado<RoomStatus>> = ambientes.map(
      (fila) => ({ estado: aEstadoRoom(fila.estado), total: fila._count._all })
    );
    const equiposPorEstado: Array<ConteoPorEstado<EquipmentStatus>> = equipos.map(
      (fila) => ({ estado: aEstadoEquipo(fila.estado), total: fila._count._all })
    );
    const prestamosPorEstado: Array<ConteoPorEstado<LoanStatus>> = prestamos.map(
      (fila) => ({ estado: aEstadoPrestamo(fila.estado), total: fila._count._all })
    );
    const novedadesPorEstado: Array<ConteoPorEstado<IncidentStatus>> =
      novedadesEstado.map((fila) => ({
        estado: aEstadoNovedad(fila.estado),
        total: fila._count._all
      }));
    const porPrioridad: ConteoPorPrioridad[] = novedadesPrioridad.map((fila) => ({
      prioridad: aPrioridad(fila.prioridad),
      total: fila._count._all
    }));

    return {
      usuariosActivos,
      ambientesPorEstado,
      equiposPorEstado,
      prestamosPorEstado,
      novedadesPorEstado,
      novedadesPorPrioridad: porPrioridad
    };
  }

  public async roomDetail(roomId: string): Promise<DashboardRoomDetail | null> {
    const sala = await this.database.room.findUnique({ where: { id: roomId } });
    if (!sala) return null;

    const [equipos, prestamos] = await Promise.all([
      this.database.equipment.findMany({
        where: { roomId },
        orderBy: { placaSena: 'asc' }
      }),
      this.database.loan.findMany({
        where: { roomId },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const ambiente: DashboardRoom = {
      id: sala.id,
      nombre: sala.nombre,
      bloque: sala.bloque,
      capacidadPcs: sala.capacidadPcs,
      estado: aEstadoRoom(sala.estado)
    };

    const equiposDominio: DashboardEquipment[] = equipos.map((equipo) => ({
      id: equipo.id,
      placaSena: equipo.placaSena,
      tipo: aTipoEquipo(equipo.tipo),
      estado: aEstadoEquipo(equipo.estado)
    }));

    const prestamosDominio: DashboardLoan[] = prestamos.map((prestamo) => ({
      id: prestamo.id.toString(),
      instructorId: prestamo.instructorId,
      numeroPc: prestamo.numeroPc,
      estado: aEstadoPrestamo(prestamo.estado),
      createdAt: prestamo.createdAt.toISOString()
    }));

    return { ambiente, equipos: equiposDominio, prestamos: prestamosDominio };
  }

  public async openIncidents(): Promise<DashboardIncidents> {
    const estadosAbiertos: IncidentStatus[] = ['PENDIENTE', 'EN_PROCESO'];

    const [filas, conteos] = await Promise.all([
      this.database.incident.findMany({
        where: { estado: { in: estadosAbiertos } },
        orderBy: { createdAt: 'desc' }
      }),
      this.database.incident.groupBy({
        by: ['prioridad'],
        where: { estado: { in: estadosAbiertos } },
        _count: { _all: true }
      })
    ]);

    const items: DashboardIncident[] = filas.map((fila) => ({
      id: fila.id.toString(),
      equipmentId: fila.equipmentId,
      descripcion: fila.descripcion,
      prioridad: aPrioridad(fila.prioridad),
      estado: aEstadoNovedad(fila.estado),
      createdAt: fila.createdAt.toISOString()
    }));

    const porPrioridad: ConteoPorPrioridad[] = conteos.map((fila) => ({
      prioridad: aPrioridad(fila.prioridad),
      total: fila._count._all
    }));

    return { items, porPrioridad };
  }
}
