import { Response } from 'express';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BIGINT = 9223372036854775807n;
export const LIMITE_POR_DEFECTO = 20;
export const LIMITE_MAXIMO = 100;

export const esObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null && !Array.isArray(valor);

export const esUuid = (valor: unknown): valor is string =>
  typeof valor === 'string' && UUID_REGEX.test(valor);

export const esBigIntPositivo = (valor: unknown): valor is string => {
  if (typeof valor !== 'string' || !/^[1-9]\d*$/.test(valor) || valor.length > 19) {
    return false;
  }
  try {
    return BigInt(valor) <= MAX_BIGINT;
  } catch {
    return false;
  }
};

export const esTextoNoVacio = (valor: unknown): valor is string =>
  typeof valor === 'string' && valor.trim().length > 0;

export const esBooleano = (valor: unknown): valor is boolean =>
  typeof valor === 'boolean';

export const esBooleanoQuery = (valor: unknown): boolean =>
  valor === 'true' || valor === 'false';

export const aBooleanoQuery = (valor: 'true' | 'false'): boolean =>
  valor === 'true';

export const camposPermitidos = (
  objeto: Record<string, unknown>,
  permitidos: readonly string[]
): boolean => Object.keys(objeto).every((clave) => permitidos.includes(clave));

export const estaEnCatalogo = <T extends string>(
  valor: unknown,
  catalogo: readonly T[]
): valor is T =>
  typeof valor === 'string' && (catalogo as readonly string[]).includes(valor);

export const responderErrorValidacion = (
  res: Response,
  mensaje: string
): void => {
  res.status(400).json({
    success: false,
    code: 'VALIDATION_ERROR',
    error: mensaje
  });
};

export const paginaLimiteDeQuery = (
  query: Record<string, unknown>
): { page?: number; limit?: number } | null => {
  const { page, limit } = query;
  const resultado: { page?: number; limit?: number } = {};

  if (page !== undefined) {
    if (typeof page !== 'string' || !/^[1-9]\d*$/.test(page)) return null;
    resultado.page = Number(page);
  }

  if (limit !== undefined) {
    if (
      typeof limit !== 'string' ||
      !/^[1-9]\d*$/.test(limit) ||
      Number(limit) > LIMITE_MAXIMO
    ) {
      return null;
    }
    resultado.limit = Number(limit);
  }

  return resultado;
};
