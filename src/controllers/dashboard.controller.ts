import { NextFunction, Request, Response } from 'express';
import { dashboardService } from '../container';

export class DashboardController {
  public static getSummary = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const resumen = await dashboardService.getSummary();
      res.status(200).json({ success: true, data: resumen });
    } catch (error) {
      next(error);
    }
  };

  public static getRoomDetail = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const detalle = await dashboardService.getRoomDetail(req.params.id);
      res.status(200).json({ success: true, data: detalle });
    } catch (error) {
      next(error);
    }
  };

  public static getIncidents = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const novedades = await dashboardService.getIncidents();
      res.status(200).json({ success: true, data: novedades });
    } catch (error) {
      next(error);
    }
  };
}
