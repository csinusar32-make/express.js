import { Request, Response } from 'express';

export class IncidentController {
  public static createIncident = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body (equipo o ambiente asociado) y responder 201.
    res.status(501).json({
      success: false,
      message: 'El registro de novedades todavía no está implementado.'
    });
  };

  public static getAllIncidents = (req: Request, res: Response): void => {
    // TODO: llamar al servicio y responder con el historial completo de incidencias.
    res.status(501).json({
      success: false,
      message: 'El historial de novedades todavía no está implementado.'
    });
  };

  public static updateIncident = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id y req.body (parcial: estado de la novedad) a la actualización.
    res.status(501).json({
      success: false,
      message: `La actualización de la novedad ${id} todavía no está implementada.`
    });
  };
}
