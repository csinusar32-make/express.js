export const ROLES_USUARIO = ['ADMIN', 'GUARDA', 'INSTRUCTOR'] as const;
export type UserRole = (typeof ROLES_USUARIO)[number];

export const esRolUsuario = (valor: unknown): valor is UserRole =>
  typeof valor === 'string' && (ROLES_USUARIO as readonly string[]).includes(valor);

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  activo: boolean;
  createdAt: string;
}
