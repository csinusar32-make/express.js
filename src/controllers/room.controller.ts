import { Request, Response } from 'express';

export class RoomController {
  public static getAllRooms = (req: Request, res: Response): void => {
    // TODO: llamar al servicio y responder con el listado de ambientes (laboratorios / salas).
    res.status(501).json({
      success: false,
      message: 'El listado de ambientes todavía no está implementado.'
    });
  };

  public static createRoom = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body (capacidad y ubicación) y responder 201.
    res.status(501).json({
      success: false,
      message: 'El registro de ambientes todavía no está implementado.'
    });
  };

  public static updateRoom = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id y req.body (parcial: capacidad o estado operativo) a la actualización.
    res.status(501).json({
      success: false,
      message: `La actualización del ambiente ${id} todavía no está implementada.`
    });
  };
}
