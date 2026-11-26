import { NextFunction, Request, Response } from 'express';
import {
  esEstadoIncident,
  esPrioridadIncident
} from '../dtos/incident.dto';
import {
  camposPermitidos,
  esBigIntPositivo,
  esObjeto,
  esTextoNoVacio,
  esUuid,
  paginaLimiteDeQuery,
  responderErrorValidacion
} from './validation';

export const validateIncidentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    camposPermitidos(body, ['equipmentId', 'reportedBy', 'descripcion', 'prioridad']) &&
    esUuid(body.equipmentId) &&
    esUuid(body.reportedBy) &&
    esTextoNoVacio(body.descripcion) &&
    esPrioridadIncident(body.prioridad);

  if (!valido) {
    responderErrorValidacion(res, 'Datos de la novedad inválidos.');
    return;
  }
  next();
};

export const validateIncidentStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    camposPermitidos(body, ['estado']) &&
    esEstadoIncident(body.estado);

  if (!valido) {
    responderErrorValidacion(res, 'El estado de la novedad no es válido.');
    return;
  }
  next();
};

export const validateIncidentIdParameter = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): void => {
  if (!esBigIntPositivo(req.params.id)) {
    responderErrorValidacion(
      res,
      'El identificador de la novedad debe ser un entero positivo.'
    );
    return;
  }
  next();
};

export const validateIncidentQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const query = req.query as Record<string, unknown>;
  const estadoValido = query.estado === undefined || esEstadoIncident(query.estado);
  const prioridadValida =
    query.prioridad === undefined || esPrioridadIncident(query.prioridad);
  const equipoValido = query.equipmentId === undefined || esUuid(query.equipmentId);
  const paginacionValida = paginaLimiteDeQuery(query) !== null;

  if (!estadoValido || !prioridadValida || !equipoValido || !paginacionValida) {
    responderErrorValidacion(
      res,
      'Filtros de novedad inválidos. Use estado, prioridad, equipmentId, page y limit con valores válidos.'
    );
    return;
  }
  next();
};
