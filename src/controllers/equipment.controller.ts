import { NextFunction, Request, Response } from 'express';
import { equipmentService } from '../container';
import {
  EquipmentStatus,
  EquipmentType,
  esEstadoEquipo,
  esTipoEquipo,
  ICreateEquipmentDTO,
  IMoveEquipmentDTO,
  IUpdateEquipmentDTO,
  IUpdateEquipmentStatusDTO
} from '../dtos/equipment.dto';
import { esUuid, paginaLimiteDeQuery } from '../middlewares/validation';

export class EquipmentController {
  public static createEquipment = async (
    req: Request<Record<string, string>, unknown, ICreateEquipmentDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const equipo = await equipmentService.createEquipment(req.body);
      res.status(201).json({ success: true, data: equipo });
    } catch (error) {
      next(error);
    }
  };

  public static getAllEquipment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as Record<string, unknown>;
      const paginacion = paginaLimiteDeQuery(query) ?? {};
      const roomId = esUuid(query.roomId) ? query.roomId : undefined;
      const estado: EquipmentStatus | undefined = esEstadoEquipo(query.estado)
        ? query.estado
        : undefined;
      const tipo: EquipmentType | undefined = esTipoEquipo(query.tipo)
        ? query.tipo
        : undefined;

      const resultado = await equipmentService.getEquipment({
        ...paginacion,
        roomId,
        estado,
        tipo
      });
      res.setHeader('X-Total-Count', String(resultado.total));
      res.status(200).json({ success: true, data: resultado.items });
    } catch (error) {
      next(error);
    }
  };

  public static getEquipmentById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const equipo = await equipmentService.getEquipmentDetail(req.params.id);
      res.status(200).json({ success: true, data: equipo });
    } catch (error) {
      next(error);
    }
  };

  public static updateEquipment = async (
    req: Request<{ id: string }, unknown, IUpdateEquipmentDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const equipo = await equipmentService.updateEquipment(req.params.id, req.body);
      res.status(200).json({ success: true, data: equipo });
    } catch (error) {
      next(error);
    }
  };

  public static moveEquipment = async (
    req: Request<{ id: string }, unknown, IMoveEquipmentDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const equipo = await equipmentService.moveEquipment(req.params.id, req.body.roomId);
      res.status(200).json({ success: true, data: equipo });
    } catch (error) {
      next(error);
    }
  };

  public static setEquipmentStatus = async (
    req: Request<{ id: string }, unknown, IUpdateEquipmentStatusDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const equipo = await equipmentService.setEquipmentStatus(req.params.id, req.body.estado);
      res.status(200).json({ success: true, data: equipo });
    } catch (error) {
      next(error);
    }
  };
}
