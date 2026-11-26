import { NextFunction, Request, Response } from 'express';
import { esUuid, responderErrorValidacion } from './validation';

export const validateDashboardRoomIdParameter = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): void => {
  if (!esUuid(req.params.id)) {
    responderErrorValidacion(
      res,
      'El identificador del ambiente debe ser un UUID válido.'
    );
    return;
  }
  next();
};
