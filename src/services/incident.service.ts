import {
  esPrioridadIncident,
  ICreateIncidentDTO,
  IncidentStatus,
  TRANSICIONES_INCIDENT
} from '../dtos/incident.dto';
import { Paginated } from '../dtos/pagination.dto';
import { DomainError } from '../errors/domain.error';
import { EquipmentRepository } from '../repositories/equipment.repository';
import {
  Incident,
  IncidentFilters,
  IncidentRepository
} from '../repositories/incident.repository';
import { UserRepository } from '../repositories/user.repository';

export class IncidentService {
  constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly equipmentRepository: EquipmentRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async createIncident(input: ICreateIncidentDTO): Promise<Incident> {
    if (!esPrioridadIncident(input.prioridad)) {
      throw new DomainError('VALIDATION_ERROR', 'La prioridad de la novedad no es válida.');
    }

    const equipo = await this.equipmentRepository.findById(input.equipmentId);
    if (!equipo) {
      throw new DomainError('NOT_FOUND', 'No existe el equipo indicado.');
    }

    const reportante = await this.userRepository.findById(input.reportedBy);
    if (!reportante) {
      throw new DomainError('NOT_FOUND', 'No existe el usuario reportante.');
    }
    if (!reportante.activo) {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El usuario reportante debe estar activo.'
      );
    }

    return this.incidentRepository.create(input);
  }

  public getIncidents(
    filters: IncidentFilters = {}
  ): Promise<Paginated<Incident>> {
    return this.incidentRepository.findAll(filters);
  }

  public async getIncidentDetail(id: string): Promise<Incident> {
    const incidente = await this.incidentRepository.findById(id);
    if (!incidente) {
      throw new DomainError('NOT_FOUND', `No existe una novedad con identificador ${id}.`);
    }
    return incidente;
  }

  public async changeStatus(
    id: string,
    estado: IncidentStatus
  ): Promise<Incident> {
    const actual = await this.incidentRepository.findById(id);
    if (!actual) {
      throw new DomainError('NOT_FOUND', `No existe una novedad con identificador ${id}.`);
    }

    const permitidos = TRANSICIONES_INCIDENT[actual.estado];
    if (!permitidos.includes(estado)) {
      throw new DomainError(
        'CONFLICT',
        `La transición de ${actual.estado} a ${estado} no está permitida.`
      );
    }

    const actualizado = await this.incidentRepository.updateStatus(
      id,
      actual.estado,
      estado
    );
    if (!actualizado) {
      throw new DomainError(
        'CONFLICT',
        'La novedad cambió de estado mientras se procesaba la solicitud.'
      );
    }
    return actualizado;
  }
}
