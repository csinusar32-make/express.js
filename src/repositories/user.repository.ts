import { Paginated, PaginationQuery } from '../dtos/pagination.dto';
import { ICreateUserDTO, IUpdateUserDTO } from '../dtos/user.dto';
import { User, UserRole } from '../models/user.model';

export type { User } from '../models/user.model';

export interface UserFilters extends PaginationQuery {
  rol?: UserRole;
  activo?: boolean;
}

export interface UserRepository {
  create(input: ICreateUserDTO): Promise<User>;
  findAll(filters?: UserFilters): Promise<Paginated<User>>;
  findById(id: string): Promise<User | null>;
  update(id: string, input: IUpdateUserDTO): Promise<User | null>;
  setActive(id: string, activo: boolean): Promise<User | null>;
}
