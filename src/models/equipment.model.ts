export const TIPOS_EQUIPO = [
  'COMPUTADOR',
  'MOUSE',
  'TECLADO',
  'CARGADOR',
  'TELEVISOR',
  'CONTROL_TV'
] as const;
export type EquipmentType = (typeof TIPOS_EQUIPO)[number];

export const ESTADOS_EQUIPO = [
  'OPERATIVO',
  'MANTENIMIENTO',
  'FUERA_DE_SERVICIO'
] as const;
export type EquipmentStatus = (typeof ESTADOS_EQUIPO)[number];

export const esTipoEquipo = (valor: unknown): valor is EquipmentType =>
  typeof valor === 'string' && (TIPOS_EQUIPO as readonly string[]).includes(valor);

export const esEstadoEquipo = (valor: unknown): valor is EquipmentStatus =>
  typeof valor === 'string' && (ESTADOS_EQUIPO as readonly string[]).includes(valor);

export interface Equipment {
  id: string;
  placaSena: string;
  codigoActivo: string;
  tipo: EquipmentType;
  roomId: string;
  estado: EquipmentStatus;
}
