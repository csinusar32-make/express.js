export const ESTADOS_LOAN = [
  'PENDIENTE_APROBACION',
  'APROBADO_Y_FIRMADO'
] as const;
export type LoanStatus = (typeof ESTADOS_LOAN)[number];

export const esEstadoLoan = (valor: unknown): valor is LoanStatus =>
  typeof valor === 'string' && (ESTADOS_LOAN as readonly string[]).includes(valor);

export interface Loan {
  id: string;
  roomId: string;
  instructorId: string;
  guardaId: string;
  numeroPc: number;
  estado: LoanStatus;
  createdAt: string;
  acceptedAt: string | null;
}
