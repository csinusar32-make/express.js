import { EquipmentStatus, EquipmentType } from './equipment.dto';
import { IncidentPriority, IncidentStatus } from './incident.dto';
import { LoanStatus } from './loan.dto';
import { RoomStatus } from './room.dto';

export interface ConteoPorEstado<T extends string> {
  estado: T;
  total: number;
}

export interface ConteoPorPrioridad {
  prioridad: IncidentPriority;
  total: number;
}

export interface DashboardSummary {
  usuariosActivos: number;
  ambientesPorEstado: Array<ConteoPorEstado<RoomStatus>>;
  equiposPorEstado: Array<ConteoPorEstado<EquipmentStatus>>;
  prestamosPorEstado: Array<ConteoPorEstado<LoanStatus>>;
  novedadesPorEstado: Array<ConteoPorEstado<IncidentStatus>>;
  novedadesPorPrioridad: ConteoPorPrioridad[];
}

export interface DashboardRoom {
  id: string;
  nombre: string;
  bloque: string;
  capacidadPcs: number;
  estado: RoomStatus;
}

export interface DashboardEquipment {
  id: string;
  placaSena: string;
  tipo: EquipmentType;
  estado: EquipmentStatus;
}

export interface DashboardLoan {
  id: string;
  instructorId: string;
  numeroPc: number;
  estado: LoanStatus;
  createdAt: string;
}

export interface DashboardIncident {
  id: string;
  equipmentId: string;
  descripcion: string;
  prioridad: IncidentPriority;
  estado: IncidentStatus;
  createdAt: string;
}

export interface DashboardRoomDetail {
  ambiente: DashboardRoom;
  equipos: DashboardEquipment[];
  prestamos: DashboardLoan[];
}

export interface DashboardIncidents {
  items: DashboardIncident[];
  porPrioridad: ConteoPorPrioridad[];
}
