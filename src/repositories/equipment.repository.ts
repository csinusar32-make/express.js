import { Paginated, PaginationQuery } from '../dtos/pagination.dto';
import { ICreateEquipmentDTO, IUpdateEquipmentDTO } from '../dtos/equipment.dto';
import { Equipment, EquipmentStatus, EquipmentType } from '../models/equipment.model';

export type { Equipment } from '../models/equipment.model';

export interface EquipmentFilters extends PaginationQuery {
  roomId?: string;
  estado?: EquipmentStatus;
  tipo?: EquipmentType;
}

export interface EquipmentRepository {
  countComputersByRoom(roomId: string): Promise<number>;
  create(input: ICreateEquipmentDTO): Promise<Equipment>;
  findAll(filters?: EquipmentFilters): Promise<Paginated<Equipment>>;
  findById(id: string): Promise<Equipment | null>;
  update(id: string, input: IUpdateEquipmentDTO): Promise<Equipment | null>;
  move(id: string, roomId: string): Promise<Equipment | null>;
  setStatus(id: string, estado: EquipmentStatus): Promise<Equipment | null>;
}
