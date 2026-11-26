import { NextFunction, Request, Response } from 'express';
import {
  camposPermitidos,
  esBigIntPositivo,
  esObjeto,
  esUuid,
  paginaLimiteDeQuery,
  responderErrorValidacion
} from './validation';

export const validateLoanPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    camposPermitidos(body, ['roomId', 'instructorId', 'guardaId', 'numeroPc']) &&
    esUuid(body.roomId) &&
    esUuid(body.instructorId) &&
    esUuid(body.guardaId) &&
    typeof body.numeroPc === 'number' &&
    Number.isInteger(body.numeroPc);

  if (!valido) {
    responderErrorValidacion(res, 'Datos del préstamo inválidos.');
    return;
  }
  next();
};

export const validateLoanIdParameter = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): void => {
  if (!esBigIntPositivo(req.params.id)) {
    responderErrorValidacion(
      res,
      'El identificador del préstamo debe ser un entero positivo.'
    );
    return;
  }
  next();
};

export const validateLoanSearchQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const query = req.query as Record<string, unknown>;
  const roomIdValido = query.roomId === undefined || esUuid(query.roomId);
  const paginacionValida = paginaLimiteDeQuery(query) !== null;

  if (!roomIdValido || !paginacionValida) {
    responderErrorValidacion(
      res,
      'El filtro roomId debe ser un UUID válido y page/limit enteros positivos.'
    );
    return;
  }
  next();
};
