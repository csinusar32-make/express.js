import { Prisma } from '@prisma/client';
import { DomainError } from './domain.error';

type CodigoPrismaTraducible = 'P2002' | 'P2003' | 'P2004';

type MensajesPrisma = Partial<Record<CodigoPrismaTraducible, string>>;

const esErrorConocido = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.PrismaClientKnownRequestError;

/**
 * Traduce únicamente los errores conocidos de Prisma a errores de dominio.
 * El resto se devuelve intacto para que llegue al manejador global.
 */
export const traducirErrorPrisma = (
  error: unknown,
  mensajes: MensajesPrisma = {}
): unknown => {
  if (!esErrorConocido(error)) {
    return error;
  }

  switch (error.code) {
    case 'P2002':
      return new DomainError(
        'CONFLICT',
        mensajes.P2002 ?? 'Ya existe un registro con esos datos únicos.'
      );
    case 'P2003':
      return new DomainError(
        'VALIDATION_ERROR',
        mensajes.P2003 ?? 'Uno de los identificadores referenciados no existe.'
      );
    case 'P2004':
      return new DomainError(
        'VALIDATION_ERROR',
        mensajes.P2004 ?? 'Los datos incumplen una restricción de la base de datos.'
      );
    default:
      return error;
  }
};
