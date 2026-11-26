import { Paginated, PaginationQuery } from '../dtos/pagination.dto';
import { ICreateIncidentDTO } from '../dtos/incident.dto';
import { Incident, IncidentPriority, IncidentStatus } from '../models/incident.model';

export type { Incident } from '../models/incident.model';

export interface IncidentFilters extends PaginationQuery {
  estado?: IncidentStatus;
  prioridad?: IncidentPriority;
  equipmentId?: string;
}

export interface IncidentRepository {
  create(input: ICreateIncidentDTO): Promise<Incident>;
  findAll(filters?: IncidentFilters): Promise<Paginated<Incident>>;
  findById(id: string): Promise<Incident | null>;
  updateStatus(
    id: string,
    expectedStatus: IncidentStatus,
    status: IncidentStatus
  ): Promise<Incident | null>;
}
