import { Request, Response } from 'express';

export class EquipmentController {
  public static createEquipment = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body (equipo vinculado a un ambiente) y responder 201.
    res.status(501).json({
      success: false,
      message: 'El registro de equipos todavía no está implementado.'
    });
  };

  public static getAllEquipment = (req: Request, res: Response): void => {
    // TODO: tomar el filtro opcional roomId de req.query, llamar al servicio y responder con los equipos.
    res.status(501).json({
      success: false,
      message: 'El listado de equipos todavía no está implementado.'
    });
  };

  public static updateEquipment = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id y req.body (parcial: estado técnico o ubicación) a la actualización.
    res.status(501).json({
      success: false,
      message: `La actualización del equipo ${id} todavía no está implementada.`
    });
  };
}
