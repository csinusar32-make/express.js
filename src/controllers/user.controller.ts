import { NextFunction, Request, Response } from 'express';
import { userService } from '../container';
import {
  esRolUsuario,
  ICreateUserDTO,
  IUpdateUserDTO,
  IUpdateUserActiveDTO,
  UserRole
} from '../dtos/user.dto';
import { aBooleanoQuery, paginaLimiteDeQuery } from '../middlewares/validation';

export class UserController {
  public static createUser = async (
    req: Request<Record<string, string>, unknown, ICreateUserDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const usuario = await userService.createUser(req.body);
      res.status(201).json({ success: true, data: usuario });
    } catch (error) {
      next(error);
    }
  };

  public static getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as Record<string, unknown>;
      const paginacion = paginaLimiteDeQuery(query) ?? {};
      const rol: UserRole | undefined = esRolUsuario(query.rol) ? query.rol : undefined;
      const activo =
        query.activo === 'true' || query.activo === 'false'
          ? aBooleanoQuery(query.activo)
          : undefined;

      const resultado = await userService.getUsers({ ...paginacion, rol, activo });
      res.setHeader('X-Total-Count', String(resultado.total));
      res.status(200).json({ success: true, data: resultado.items });
    } catch (error) {
      next(error);
    }
  };

  public static getUserById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const usuario = await userService.getUserDetail(req.params.id);
      res.status(200).json({ success: true, data: usuario });
    } catch (error) {
      next(error);
    }
  };

  public static updateUser = async (
    req: Request<{ id: string }, unknown, IUpdateUserDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const usuario = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({ success: true, data: usuario });
    } catch (error) {
      next(error);
    }
  };

  public static setUserActive = async (
    req: Request<{ id: string }, unknown, IUpdateUserActiveDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const usuario = await userService.setUserActive(req.params.id, req.body.activo);
      res.status(200).json({ success: true, data: usuario });
    } catch (error) {
      next(error);
    }
  };
}
