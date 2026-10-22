import { Request, Response, NextFunction } from 'express';
import { ICreateIncidentDTO } from '../dtos/incident.dto';

const isPositiveInteger = (value: unknown): boolean =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const isCreateIncidentDTO = (value: unknown): value is ICreateIncidentDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const incident = value as Record<string, unknown>;
  return (
    typeof incident.descripcion === 'string' &&
    incident.descripcion.trim() !== '' &&
    (isPositiveInteger(incident.equipoId) ||
      isPositiveInteger(incident.ambienteId))
  );
};

export const validateIncidentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateIncidentDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos de la novedad inválidos.'
    });
    return;
  }

  next();
};
