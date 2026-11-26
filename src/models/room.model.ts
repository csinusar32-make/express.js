export const ESTADOS_ROOM = ['OPERATIVO', 'MANTENIMIENTO', 'INACTIVO'] as const;
export type RoomStatus = (typeof ESTADOS_ROOM)[number];

export const esEstadoRoom = (valor: unknown): valor is RoomStatus =>
  typeof valor === 'string' && (ESTADOS_ROOM as readonly string[]).includes(valor);

export interface Room {
  id: string;
  nombre: string;
  bloque: string;
  capacidadPcs: number;
  estado: RoomStatus;
}
