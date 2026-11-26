import { NextFunction, Request, Response } from 'express';
import { esEstadoEquipo, esTipoEquipo } from '../dtos/equipment.dto';
import {
  camposPermitidos,
  esObjeto,
  esTextoNoVacio,
  esUuid,
  paginaLimiteDeQuery,
  responderErrorValidacion
} from './validation';

export const validateEquipmentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    camposPermitidos(body, ['placaSena', 'codigoActivo', 'tipo', 'roomId', 'estado']) &&
    esTextoNoVacio(body.placaSena) &&
    esTextoNoVacio(body.codigoActivo) &&
    esTipoEquipo(body.tipo) &&
    esUuid(body.roomId) &&
    (body.estado === undefined || esEstadoEquipo(body.estado));

  if (!valido) {
    responderErrorValidacion(res, 'Datos del equipo inválidos.');
    return;
  }
  next();
};

export const validateEquipmentUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    Object.keys(body).length > 0 &&
    camposPermitidos(body, ['placaSena', 'codigoActivo', 'tipo']) &&
    (body.placaSena === undefined || esTextoNoVacio(body.placaSena)) &&
    (body.codigoActivo === undefined || esTextoNoVacio(body.codigoActivo)) &&
    (body.tipo === undefined || esTipoEquipo(body.tipo));

  if (!valido) {
    responderErrorValidacion(res, 'Datos de actualización del equipo inválidos.');
    return;
  }
  next();
};

export const validateEquipmentMove = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    camposPermitidos(body, ['roomId']) &&
    esUuid(body.roomId);

  if (!valido) {
    responderErrorValidacion(res, 'El ambiente destino debe ser un UUID válido.');
    return;
  }
  next();
};

export const validateEquipmentStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    camposPermitidos(body, ['estado']) &&
    esEstadoEquipo(body.estado);

  if (!valido) {
    responderErrorValidacion(res, 'El estado del equipo no es válido.');
    return;
  }
  next();
};

export const validateEquipmentIdParameter = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): void => {
  if (!esUuid(req.params.id)) {
    responderErrorValidacion(res, 'El identificador del equipo debe ser un UUID válido.');
    return;
  }
  next();
};

export const validateEquipmentQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const query = req.query as Record<string, unknown>;
  const roomIdValido = query.roomId === undefined || esUuid(query.roomId);
  const estadoValido = query.estado === undefined || esEstadoEquipo(query.estado);
  const tipoValido = query.tipo === undefined || esTipoEquipo(query.tipo);
  const paginacionValida = paginaLimiteDeQuery(query) !== null;

  if (!roomIdValido || !estadoValido || !tipoValido || !paginacionValida) {
    responderErrorValidacion(
      res,
      'Filtros de equipo inválidos. Use roomId, estado, tipo, page y limit con valores válidos.'
    );
    return;
  }
  next();
};
