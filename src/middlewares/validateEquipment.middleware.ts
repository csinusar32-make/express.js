import { Request, Response, NextFunction } from 'express';
import { ICreateEquipmentDTO } from '../dtos/equipment.dto';

const isCreateEquipmentDTO = (value: unknown): value is ICreateEquipmentDTO => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const equipment = value as Record<string, unknown>;
  return (
    typeof equipment.nombre === 'string' &&
    equipment.nombre.trim() !== '' &&
    typeof equipment.serial === 'string' &&
    equipment.serial.trim() !== '' &&
    typeof equipment.ambienteId === 'number' &&
    Number.isInteger(equipment.ambienteId) &&
    equipment.ambienteId > 0
  );
};

export const validateEquipmentPayload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body: unknown = req.body;

  if (!isCreateEquipmentDTO(body)) {
    res.status(400).json({
      success: false,
      error: 'Datos del equipo inválidos.'
    });
    return;
  }

  next();
};
