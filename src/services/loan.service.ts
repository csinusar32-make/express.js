import { Paginated } from '../dtos/pagination.dto';
import { ICreateLoanDTO } from '../dtos/loan.dto';
import { DomainError } from '../errors/domain.error';
import { Loan, LoanFilters, LoanRepository } from '../repositories/loan.repository';
import { RoomRepository } from '../repositories/room.repository';
import { UserRepository } from '../repositories/user.repository';

export class LoanService {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async createLoan(input: ICreateLoanDTO): Promise<Loan> {
    // TODO: derivar guardaId de la identidad autenticada cuando exista autenticación.
    // Hoy se recibe en el body solo como dato de práctica.

    const sala = await this.roomRepository.findById(input.roomId);
    if (!sala) {
      throw new DomainError('NOT_FOUND', 'No existe el ambiente indicado.');
    }
    if (sala.estado !== 'OPERATIVO') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El ambiente indicado no está operativo y no admite préstamos nuevos.'
      );
    }

    const instructor = await this.userRepository.findById(input.instructorId);
    if (!instructor) {
      throw new DomainError('NOT_FOUND', 'No existe el instructor indicado.');
    }
    if (!instructor.activo || instructor.rol !== 'INSTRUCTOR') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El instructor debe estar activo y tener rol INSTRUCTOR.'
      );
    }

    const guarda = await this.userRepository.findById(input.guardaId);
    if (!guarda) {
      throw new DomainError('NOT_FOUND', 'No existe el guarda indicado.');
    }
    if (!guarda.activo || guarda.rol !== 'GUARDA') {
      throw new DomainError(
        'VALIDATION_ERROR',
        'El guarda debe estar activo y tener rol GUARDA.'
      );
    }

    // numeroPc > 0 lo garantiza el CHECK de PostgreSQL; P2004 se traduce a 400.
    return this.loanRepository.create(input);
  }

  public getLoans(filters: LoanFilters = {}): Promise<Paginated<Loan>> {
    return this.loanRepository.findAll(filters);
  }

  public async getLoanDetail(id: string): Promise<Loan> {
    const prestamo = await this.loanRepository.findById(id);
    if (!prestamo) {
      throw new DomainError('NOT_FOUND', `No existe un préstamo con identificador ${id}.`);
    }
    return prestamo;
  }

  public async acceptLoan(id: string): Promise<Loan> {
    const actualizado = await this.loanRepository.updateStatus(
      id,
      'PENDIENTE_APROBACION',
      'APROBADO_Y_FIRMADO'
    );
    if (actualizado) {
      return actualizado;
    }

    const actual = await this.loanRepository.findById(id);
    if (!actual) {
      throw new DomainError('NOT_FOUND', `No existe un préstamo con identificador ${id}.`);
    }
    throw new DomainError(
      'CONFLICT',
      'El préstamo ya fue aceptado y no puede aceptarse nuevamente.'
    );
  }
}
