import { PaginationQuery } from './pagination.dto';
import type { LoanStatus } from '../models/loan.model';

export { ESTADOS_LOAN, esEstadoLoan } from '../models/loan.model';
export type { LoanStatus } from '../models/loan.model';

export interface ICreateLoanDTO {
  roomId: string;
  instructorId: string;
  guardaId: string;
  numeroPc: number;
}

export interface ILoanQuery extends PaginationQuery {
  roomId?: string;
}
