import { PaginationQuery } from './pagination.dto';
import type { EquipmentStatus, EquipmentType } from '../models/equipment.model';

export {
  TIPOS_EQUIPO,
  ESTADOS_EQUIPO,
  esTipoEquipo,
  esEstadoEquipo
} from '../models/equipment.model';
export type { EquipmentStatus, EquipmentType } from '../models/equipment.model';

export interface ICreateEquipmentDTO {
  placaSena: string;
  codigoActivo: string;
  tipo: EquipmentType;
  roomId: string;
  estado?: EquipmentStatus;
}

export interface IUpdateEquipmentDTO {
  placaSena?: string;
  codigoActivo?: string;
  tipo?: EquipmentType;
}

export interface IMoveEquipmentDTO {
  roomId: string;
}

export interface IUpdateEquipmentStatusDTO {
  estado: EquipmentStatus;
}

export interface IEquipmentQuery extends PaginationQuery {
  roomId?: string;
  estado?: EquipmentStatus;
  tipo?: EquipmentType;
}
