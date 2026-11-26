import { NextFunction, Request, Response } from 'express';
import { roomService } from '../container';
import {
  esEstadoRoom,
  ICreateRoomDTO,
  IUpdateRoomDTO,
  IUpdateRoomStatusDTO,
  RoomStatus
} from '../dtos/room.dto';
import { paginaLimiteDeQuery } from '../middlewares/validation';

export class RoomController {
  public static createRoom = async (
    req: Request<Record<string, string>, unknown, ICreateRoomDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sala = await roomService.createRoom(req.body);
      res.status(201).json({ success: true, data: sala });
    } catch (error) {
      next(error);
    }
  };

  public static getAllRooms = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as Record<string, unknown>;
      const paginacion = paginaLimiteDeQuery(query) ?? {};
      const estado: RoomStatus | undefined = esEstadoRoom(query.estado)
        ? query.estado
        : undefined;
      const bloque = typeof query.bloque === 'string' ? query.bloque : undefined;

      const resultado = await roomService.getRooms({ ...paginacion, estado, bloque });
      res.setHeader('X-Total-Count', String(resultado.total));
      res.status(200).json({ success: true, data: resultado.items });
    } catch (error) {
      next(error);
    }
  };

  public static getRoomById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sala = await roomService.getRoomDetail(req.params.id);
      res.status(200).json({ success: true, data: sala });
    } catch (error) {
      next(error);
    }
  };

  public static updateRoom = async (
    req: Request<{ id: string }, unknown, IUpdateRoomDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sala = await roomService.updateRoom(req.params.id, req.body);
      res.status(200).json({ success: true, data: sala });
    } catch (error) {
      next(error);
    }
  };

  public static setRoomStatus = async (
    req: Request<{ id: string }, unknown, IUpdateRoomStatusDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sala = await roomService.setRoomStatus(req.params.id, req.body.estado);
      res.status(200).json({ success: true, data: sala });
    } catch (error) {
      next(error);
    }
  };
}
