import { NextFunction, Request, Response } from 'express';
import { esRolUsuario } from '../dtos/user.dto';
import {
  camposPermitidos,
  esBooleano,
  esBooleanoQuery,
  esObjeto,
  esTextoNoVacio,
  esUuid,
  paginaLimiteDeQuery,
  responderErrorValidacion
} from './validation';

export const validateUserPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    camposPermitidos(body, ['email', 'nombre', 'rol', 'activo']) &&
    esTextoNoVacio(body.email) &&
    esTextoNoVacio(body.nombre) &&
    esRolUsuario(body.rol) &&
    (body.activo === undefined || esBooleano(body.activo));

  if (!valido) {
    responderErrorValidacion(res, 'Datos del usuario inválidos.');
    return;
  }
  next();
};

export const validateUserUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    Object.keys(body).length > 0 &&
    camposPermitidos(body, ['email', 'nombre', 'rol']) &&
    (body.email === undefined || esTextoNoVacio(body.email)) &&
    (body.nombre === undefined || esTextoNoVacio(body.nombre)) &&
    (body.rol === undefined || esRolUsuario(body.rol));

  if (!valido) {
    responderErrorValidacion(res, 'Datos de actualización del usuario inválidos.');
    return;
  }
  next();
};

export const validateUserActive = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;
  const valido =
    esObjeto(body) &&
    camposPermitidos(body, ['activo']) &&
    esBooleano(body.activo);

  if (!valido) {
    responderErrorValidacion(res, 'El campo activo debe ser booleano.');
    return;
  }
  next();
};

export const validateUserIdParameter = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): void => {
  if (!esUuid(req.params.id)) {
    responderErrorValidacion(res, 'El identificador del usuario debe ser un UUID válido.');
    return;
  }
  next();
};

export const validateUserQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const query = req.query as Record<string, unknown>;
  const rolValido = query.rol === undefined || esRolUsuario(query.rol);
  const activoValido = query.activo === undefined || esBooleanoQuery(query.activo);
  const paginacionValida = paginaLimiteDeQuery(query) !== null;

  if (!rolValido || !activoValido || !paginacionValida) {
    responderErrorValidacion(
      res,
      'Filtros de usuario inválidos. Use rol, activo, page y limit con valores válidos.'
    );
    return;
  }
  next();
};
