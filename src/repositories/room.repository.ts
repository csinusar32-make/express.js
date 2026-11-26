import { Paginated, PaginationQuery } from '../dtos/pagination.dto';
import { ICreateRoomDTO, IUpdateRoomDTO } from '../dtos/room.dto';
import { Room, RoomStatus } from '../models/room.model';

export type { Room } from '../models/room.model';

export interface RoomFilters extends PaginationQuery {
  estado?: RoomStatus;
  bloque?: string;
}

export interface RoomRepository {
  create(input: ICreateRoomDTO): Promise<Room>;
  findAll(filters?: RoomFilters): Promise<Paginated<Room>>;
  findById(id: string): Promise<Room | null>;
  update(id: string, input: IUpdateRoomDTO): Promise<Room | null>;
  setStatus(id: string, estado: RoomStatus): Promise<Room | null>;
}
