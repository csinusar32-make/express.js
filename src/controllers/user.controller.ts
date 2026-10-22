import { Request, Response } from 'express';

export class UserController {
  public static getAllUsers = (req: Request, res: Response): void => {
    // TODO: llamar al servicio y responder con el listado completo de usuarios.
    res.status(501).json({
      success: false,
      message: 'El listado de usuarios todavía no está implementado.'
    });
  };

  public static createUser = (req: Request, res: Response): void => {
    // TODO: llamar al servicio con req.body (perfil: estudiante, docente o administrador) y responder 201.
    res.status(501).json({
      success: false,
      message: 'El registro de usuarios todavía no está implementado.'
    });
  };

  public static getUserById = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id a la operación de consulta y responder con el usuario encontrado.
    res.status(501).json({
      success: false,
      message: `La consulta del usuario ${id} todavía no está implementada.`
    });
  };

  public static updateUser = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: pasar id y req.body (parcial: rol, estado de cuenta o contraseña) a la actualización.
    res.status(501).json({
      success: false,
      message: `La actualización del usuario ${id} todavía no está implementada.`
    });
  };

  public static deleteUser = (req: Request, res: Response): void => {
    const { id } = req.params;
    // TODO: realizar el borrado lógico (marcar la cuenta como inactiva) del usuario.
    res.status(501).json({
      success: false,
      message: `La eliminación lógica del usuario ${id} todavía no está implementada.`
    });
  };
}
