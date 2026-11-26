import { PaginationQuery } from './pagination.dto';
import type { RoomStatus } from '../models/room.model';

export { ESTADOS_ROOM, esEstadoRoom } from '../models/room.model';
export type { RoomStatus } from '../models/room.model';

export interface ICreateRoomDTO {
  nombre: string;
  bloque: string;
  capacidadPcs: number;
  estado?: RoomStatus;
}

export interface IUpdateRoomDTO {
  nombre?: string;
  bloque?: string;
  capacidadPcs?: number;
}

export interface IUpdateRoomStatusDTO {
  estado: RoomStatus;
}

export interface IRoomQuery extends PaginationQuery {
  estado?: RoomStatus;
  bloque?: string;
}
