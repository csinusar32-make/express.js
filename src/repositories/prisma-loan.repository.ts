import { Loan as PrismaLoan, Prisma, PrismaClient } from '@prisma/client';
import { Paginated } from '../dtos/pagination.dto';
import { ICreateLoanDTO } from '../dtos/loan.dto';
import { Loan, LoanStatus } from '../models/loan.model';
import { traducirErrorPrisma } from '../errors/prisma-error.mapper';
import { LIMITE_POR_DEFECTO } from '../middlewares/validation';
import { LoanFilters, LoanRepository } from './loan.repository';

const aEstado = (valor: string): LoanStatus => {
  if (valor === 'PENDIENTE_APROBACION' || valor === 'APROBADO_Y_FIRMADO') {
    return valor;
  }
  throw new Error(`Estado de préstamo no reconocido en la base de datos: ${valor}`);
};

const aDominio = (prestamo: PrismaLoan): Loan => ({
  id: prestamo.id.toString(),
  roomId: prestamo.roomId,
  instructorId: prestamo.instructorId,
  guardaId: prestamo.guardaId,
  numeroPc: prestamo.numeroPc,
  estado: aEstado(prestamo.estado),
  createdAt: prestamo.createdAt.toISOString(),
  acceptedAt: prestamo.acceptedAt?.toISOString() ?? null
});

export class PrismaLoanRepository implements LoanRepository {
  constructor(private readonly database: PrismaClient) {}

  public async create(input: ICreateLoanDTO): Promise<Loan> {
    try {
      const prestamo = await this.database.loan.create({
        data: {
          roomId: input.roomId,
          instructorId: input.instructorId,
          guardaId: input.guardaId,
          numeroPc: input.numeroPc
        }
      });
      return aDominio(prestamo);
    } catch (error) {
      throw traducirErrorPrisma(error, {
        P2003: 'La sala, el instructor o el guarda indicados no existen.',
        P2004: 'El número de computadores debe ser mayor que cero.'
      });
    }
  }

  public async findAll(filters: LoanFilters = {}): Promise<Paginated<Loan>> {
    const where: Prisma.LoanWhereInput = filters.roomId
      ? { roomId: filters.roomId }
      : {};

    const limite = filters.limit ?? (filters.page ? LIMITE_POR_DEFECTO : undefined);
    const [filas, total] = await Promise.all([
      this.database.loan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: filters.page ? (filters.page - 1) * (limite ?? LIMITE_POR_DEFECTO) : undefined,
        take: limite
      }),
      this.database.loan.count({ where })
    ]);

    return { items: filas.map(aDominio), total };
  }

  public async findById(id: string): Promise<Loan | null> {
    const prestamo = await this.database.loan.findUnique({
      where: { id: BigInt(id) }
    });
    return prestamo ? aDominio(prestamo) : null;
  }

  public async updateStatus(
    id: string,
    expectedStatus: LoanStatus,
    status: LoanStatus
  ): Promise<Loan | null> {
    const resultado = await this.database.loan.updateMany({
      where: { id: BigInt(id), estado: expectedStatus },
      data: {
        estado: status,
        acceptedAt: status === 'APROBADO_Y_FIRMADO' ? new Date() : null
      }
    });

    return resultado.count === 0 ? null : this.findById(id);
  }
}
