import { Paginated } from '../dtos/pagination.dto';
import {
  esRolUsuario,
  ICreateUserDTO,
  IUpdateUserDTO
} from '../dtos/user.dto';
import { DomainError } from '../errors/domain.error';
import { User, UserFilters, UserRepository } from '../repositories/user.repository';

const normalizarEmail = (email: string): string => email.trim().toLowerCase();

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(input: ICreateUserDTO): Promise<User> {
    if (!esRolUsuario(input.rol)) {
      throw new DomainError('VALIDATION_ERROR', 'El rol del usuario no es válido.');
    }
    return this.userRepository.create({
      ...input,
      email: normalizarEmail(input.email),
      rol: input.rol
    });
  }

  public getUsers(filters: UserFilters = {}): Promise<Paginated<User>> {
    return this.userRepository.findAll(filters);
  }

  public async getUserDetail(id: string): Promise<User> {
    const usuario = await this.userRepository.findById(id);
    if (!usuario) {
      throw new DomainError('NOT_FOUND', `No existe un usuario con identificador ${id}.`);
    }
    return usuario;
  }

  public async updateUser(id: string, input: IUpdateUserDTO): Promise<User> {
    if (input.rol !== undefined && !esRolUsuario(input.rol)) {
      throw new DomainError('VALIDATION_ERROR', 'El rol del usuario no es válido.');
    }

    const datos = input.email === undefined
      ? input
      : { ...input, email: normalizarEmail(input.email) };

    const usuario = await this.userRepository.update(id, datos);
    if (!usuario) {
      throw new DomainError('NOT_FOUND', `No existe un usuario con identificador ${id}.`);
    }
    return usuario;
  }

  public async setUserActive(id: string, activo: boolean): Promise<User> {
    const usuario = await this.userRepository.setActive(id, activo);
    if (!usuario) {
      throw new DomainError('NOT_FOUND', `No existe un usuario con identificador ${id}.`);
    }
    return usuario;
  }
}
