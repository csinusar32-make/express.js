import {
  EquipmentStatus,
  EquipmentType,
  esEstadoEquipo,
  esTipoEquipo,
  ICreateEquipmentDTO,
  IUpdateEquipmentDTO
} from '../dtos/equipment.dto';
import { Paginated } from '../dtos/pagination.dto';
import { DomainError } from '../errors/domain.error';
import {
  Equipment,
  EquipmentFilters,
  EquipmentRepository
} from '../repositories/equipment.repository';
import { RoomRepository } from '../repositories/room.repository';

export class EquipmentService {
  constructor(
    private readonly equipmentRepository: EquipmentRepository,
    private readonly roomRepository: RoomRepository
  ) {}

  public async createEquipment(input: ICreateEquipmentDTO): Promise<Equipment> {
    if (!esTipoEquipo(input.tipo)) {
      throw new DomainError('VALIDATION_ERROR', 'El tipo de equipo no es válido.');
    }
    if (input.estado !== undefined && !esEstadoEquipo(input.estado)) {
      throw new DomainError('VALIDATION_ERROR', 'El estado del equipo no es válido.');
    }
    await this.validarAmbienteDestino(input.roomId, input.tipo);
    return this.equipmentRepository.create(input);
  }

  public getEquipment(filters: EquipmentFilters = {}): Promise<Paginated<Equipment>> {
    return this.equipmentRepository.findAll(filters);
  }

  public async getEquipmentDetail(id: string): Promise<Equipment> {
    const equipo = await this.equipmentRepository.findById(id);
    if (!equipo) {
      throw new DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
    }
    return equipo;
  }

  public async updateEquipment(id: string, input: IUpdateEquipmentDTO): Promise<Equipment> {
    if (input.tipo !== undefined && !esTipoEquipo(input.tipo)) {
      throw new DomainError('VALIDATION_ERROR', 'El tipo de equipo no es válido.');
    }
    const equipo = await this.equipmentRepository.update(id, input);
    if (!equipo) {
      throw new DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
    }
    return equipo;
  }

  public async moveEquipment(id: string, roomId: string): Promise<Equipment> {
    const equipo = await this.equipmentRepository.findById(id);
    if (!equipo) {
      throw new DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
    }
    if (equipo.estado === 'FUERA_DE_SERVICIO') {
      throw new DomainError(
        'CONFLICT',
        'Un equipo fuera de servicio no puede ser trasladado.'
      );
    }
    if (equipo.roomId === roomId) {
      return equipo;
    }

    await this.validarAmbienteDestino(roomId, equipo.tipo);
    const movido = await this.equipmentRepository.move(id, roomId);
    if (!movido) {
      throw new DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
    }
    return movido;
  }

  public async setEquipmentStatus(
    id: string,
    estado: EquipmentStatus
  ): Promise<Equipment> {
    if (!esEstadoEquipo(estado)) {
      throw new DomainError('VALIDATION_ERROR', 'El estado del equipo no es válido.');
    }
    const equipo = await this.equipmentRepository.setStatus(id, estado);
    if (!equipo) {
      throw new DomainError('NOT_FOUND', `No existe un equipo con identificador ${id}.`);
    }
    return equipo;
  }

  private async validarAmbienteDestino(
    roomId: string,
    tipo: EquipmentType
  ): Promise<void> {
    const sala = await this.roomRepository.findById(roomId);
    if (!sala) {
      throw new DomainError('NOT_FOUND', `No existe un ambiente con identificador ${roomId}.`);
    }
    if (sala.estado !== 'OPERATIVO') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El ambiente destino debe estar OPERATIVO.'
      );
    }
    if (tipo === 'COMPUTADOR') {
      const instalados = await this.equipmentRepository.countComputersByRoom(roomId);
      if (instalados >= sala.capacidadPcs) {
        throw new DomainError(
          'VALIDATION_ERROR',
          `El ambiente destino ya tiene ${instalados} computadores y su capacidad es ${sala.capacidadPcs}.`
        );
      }
    }
  }
}
