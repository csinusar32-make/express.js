import { PaginationQuery } from './pagination.dto';
import type { UserRole } from '../models/user.model';

export { ROLES_USUARIO, esRolUsuario } from '../models/user.model';
export type { UserRole } from '../models/user.model';

export interface ICreateUserDTO {
  email: string;
  nombre: string;
  rol: UserRole;
  activo?: boolean;
}

export interface IUpdateUserDTO {
  email?: string;
  nombre?: string;
  rol?: UserRole;
}

export interface IUpdateUserActiveDTO {
  activo: boolean;
}

export interface IUserQuery extends PaginationQuery {
  rol?: UserRole;
  activo?: boolean;
}
