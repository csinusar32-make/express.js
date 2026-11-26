import { PaginationQuery } from './pagination.dto';
import type { IncidentPriority, IncidentStatus } from '../models/incident.model';

export {
  PRIORIDADES_INCIDENT,
  ESTADOS_INCIDENT,
  TRANSICIONES_INCIDENT,
  esPrioridadIncident,
  esEstadoIncident
} from '../models/incident.model';
export type { IncidentPriority, IncidentStatus } from '../models/incident.model';

export interface ICreateIncidentDTO {
  equipmentId: string;
  reportedBy: string;
  descripcion: string;
  prioridad: IncidentPriority;
}

export interface IUpdateIncidentStatusDTO {
  estado: IncidentStatus;
}

export interface IIncidentQuery extends PaginationQuery {
  estado?: IncidentStatus;
  prioridad?: IncidentPriority;
  equipmentId?: string;
}
