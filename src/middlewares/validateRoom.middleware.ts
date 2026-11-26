import { NextFunction, Request, Response } from 'express';
import { esEstadoRoom } from '../dtos/room.dto';
import {
  camposPermitidos,
  esObjeto,
  esTextoNoVacio,
  esUuid,
  paginaLimiteDeQuery,
  responderErrorValidacion
} from './validation';

const esCapacidadValida = (valor: unknown): boolean =>
  typeof valor === 'number' && Number.isInteger(valor) && valor >= 0;

export const validateRoomPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    camposPermitidos(body, ['nombre', 'bloque', 'capacidadPcs', 'estado']) &&
    esTextoNoVacio(body.nombre) &&
    esTextoNoVacio(body.bloque) &&
    esCapacidadValida(body.capacidadPcs) &&
    (body.estado === undefined || esEstadoRoom(body.estado));

  if (!valido) {
    responderErrorValidacion(res, 'Datos del ambiente inválidos.');
    return;
  }
  next();
};

export const validateRoomUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    Object.keys(body).length > 0 &&
    camposPermitidos(body, ['nombre', 'bloque', 'capacidadPcs']) &&
    (body.nombre === undefined || esTextoNoVacio(body.nombre)) &&
    (body.bloque === undefined || esTextoNoVacio(body.bloque)) &&
    (body.capacidadPcs === undefined || esCapacidadValida(body.capacidadPcs));

  if (!valido) {
    responderErrorValidacion(res, 'Datos de actualización del ambiente inválidos.');
    return;
  }
  next();
};

export const validateRoomStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    camposPermitidos(body, ['estado']) &&
    esEstadoRoom(body.estado);

  if (!valido) {
    responderErrorValidacion(res, 'El estado del ambiente no es válido.');
    return;
  }
  next();
};

export const validateRoomIdParameter = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): void => {
  if (!esUuid(req.params.id)) {
    responderErrorValidacion(res, 'El identificador del ambiente debe ser un UUID válido.');
    return;
  }
  next();
};

export const validateRoomQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const query = req.query as Record<string, unknown>;
  const estadoValido = query.estado === undefined || esEstadoRoom(query.estado);
  const bloqueValido = query.bloque === undefined || esTextoNoVacio(query.bloque);
  const paginacionValida = paginaLimiteDeQuery(query) !== null;

  if (!estadoValido || !bloqueValido || !paginacionValida) {
    responderErrorValidacion(
      res,
      'Filtros de ambiente inválidos. Use estado, bloque, page y limit con valores válidos.'
    );
    return;
  }
  next();
};
