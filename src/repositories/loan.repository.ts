import { Paginated, PaginationQuery } from '../dtos/pagination.dto';
import { ICreateLoanDTO } from '../dtos/loan.dto';
import { Loan, LoanStatus } from '../models/loan.model';

export type { Loan } from '../models/loan.model';

export interface LoanFilters extends PaginationQuery {
  roomId?: string;
}

export interface LoanRepository {
  create(input: ICreateLoanDTO): Promise<Loan>;
  findAll(filters?: LoanFilters): Promise<Paginated<Loan>>;
  findById(id: string): Promise<Loan | null>;
  updateStatus(
    id: string,
    expectedStatus: LoanStatus,
    status: LoanStatus
  ): Promise<Loan | null>;
}
