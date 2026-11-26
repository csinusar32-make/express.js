import { NextFunction, Request, Response } from 'express';
import { loanService } from '../container';
import { ICreateLoanDTO } from '../dtos/loan.dto';
import { esUuid, paginaLimiteDeQuery } from '../middlewares/validation';

export class LoanController {
  public static createLoan = async (
    req: Request<Record<string, string>, unknown, ICreateLoanDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const prestamo = await loanService.createLoan(req.body);
      res.status(201).json({ success: true, data: prestamo });
    } catch (error) {
      next(error);
    }
  };

  public static getLoansByFilter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as Record<string, unknown>;
      const paginacion = paginaLimiteDeQuery(query) ?? {};
      const roomId = esUuid(query.roomId) ? query.roomId : undefined;

      const resultado = await loanService.getLoans({ ...paginacion, roomId });
      res.setHeader('X-Total-Count', String(resultado.total));
      res.status(200).json({ success: true, data: resultado.items });
    } catch (error) {
      next(error);
    }
  };

  public static getLoanById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const prestamo = await loanService.getLoanDetail(req.params.id);
      res.status(200).json({ success: true, data: prestamo });
    } catch (error) {
      next(error);
    }
  };

  public static acceptLoanInventory = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const prestamo = await loanService.acceptLoan(req.params.id);
      res.status(200).json({ success: true, data: prestamo });
    } catch (error) {
      next(error);
    }
  };
}
