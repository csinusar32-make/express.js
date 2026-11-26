import { NextFunction, Request, Response } from 'express';
import { incidentService } from '../container';
import {
  esEstadoIncident,
  esPrioridadIncident,
  ICreateIncidentDTO,
  IUpdateIncidentStatusDTO,
  IncidentPriority,
  IncidentStatus
} from '../dtos/incident.dto';
import { esUuid, paginaLimiteDeQuery } from '../middlewares/validation';

export class IncidentController {
  public static createIncident = async (
    req: Request<Record<string, string>, unknown, ICreateIncidentDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const incidente = await incidentService.createIncident(req.body);
      res.status(201).json({ success: true, data: incidente });
    } catch (error) {
      next(error);
    }
  };

  public static getAllIncidents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as Record<string, unknown>;
      const paginacion = paginaLimiteDeQuery(query) ?? {};
      const estado: IncidentStatus | undefined = esEstadoIncident(query.estado)
        ? query.estado
        : undefined;
      const prioridad: IncidentPriority | undefined = esPrioridadIncident(query.prioridad)
        ? query.prioridad
        : undefined;
      const equipmentId = esUuid(query.equipmentId) ? query.equipmentId : undefined;

      const resultado = await incidentService.getIncidents({
        ...paginacion,
        estado,
        prioridad,
        equipmentId
      });
      res.setHeader('X-Total-Count', String(resultado.total));
      res.status(200).json({ success: true, data: resultado.items });
    } catch (error) {
      next(error);
    }
  };

  public static getIncidentById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const incidente = await incidentService.getIncidentDetail(req.params.id);
      res.status(200).json({ success: true, data: incidente });
    } catch (error) {
      next(error);
    }
  };

  public static changeIncidentStatus = async (
    req: Request<{ id: string }, unknown, IUpdateIncidentStatusDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const incidente = await incidentService.changeStatus(req.params.id, req.body.estado);
      res.status(200).json({ success: true, data: incidente });
    } catch (error) {
      next(error);
    }
  };
}
