import { Paginated } from '../dtos/pagination.dto';
import {
  esEstadoRoom,
  ICreateRoomDTO,
  IUpdateRoomDTO,
  RoomStatus
} from '../dtos/room.dto';
import { DomainError } from '../errors/domain.error';
import { EquipmentRepository } from '../repositories/equipment.repository';
import { Room, RoomFilters, RoomRepository } from '../repositories/room.repository';

export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly equipmentRepository: EquipmentRepository
  ) {}

  public async createRoom(input: ICreateRoomDTO): Promise<Room> {
    if (input.estado !== undefined && !esEstadoRoom(input.estado)) {
      throw new DomainError('VALIDATION_ERROR', 'El estado del ambiente no es válido.');
    }
    return this.roomRepository.create(input);
  }

  public getRooms(filters: RoomFilters = {}): Promise<Paginated<Room>> {
    return this.roomRepository.findAll(filters);
  }

  public async getRoomDetail(id: string): Promise<Room> {
    const sala = await this.roomRepository.findById(id);
    if (!sala) {
      throw new DomainError('NOT_FOUND', `No existe un ambiente con identificador ${id}.`);
    }
    return sala;
  }

  public async updateRoom(id: string, input: IUpdateRoomDTO): Promise<Room> {
    if (input.capacidadPcs !== undefined) {
      const sala = await this.roomRepository.findById(id);
      if (!sala) {
        throw new DomainError('NOT_FOUND', `No existe un ambiente con identificador ${id}.`);
      }
      const instalados = await this.equipmentRepository.countComputersByRoom(id);
      if (input.capacidadPcs < instalados) {
        throw new DomainError(
          'VALIDATION_ERROR',
          `La capacidad no puede ser menor que los ${instalados} computadores instalados en el ambiente.`
        );
      }
    }

    const sala = await this.roomRepository.update(id, input);
    if (!sala) {
      throw new DomainError('NOT_FOUND', `No existe un ambiente con identificador ${id}.`);
    }
    return sala;
  }

  public async setRoomStatus(id: string, estado: RoomStatus): Promise<Room> {
    if (!esEstadoRoom(estado)) {
      throw new DomainError('VALIDATION_ERROR', 'El estado del ambiente no es válido.');
    }
    const sala = await this.roomRepository.setStatus(id, estado);
    if (!sala) {
      throw new DomainError('NOT_FOUND', `No existe un ambiente con identificador ${id}.`);
    }
    return sala;
  }
}
