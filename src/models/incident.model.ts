export const PRIORIDADES_INCIDENT = ['BAJA', 'MEDIA', 'ALTA'] as const;
export type IncidentPriority = (typeof PRIORIDADES_INCIDENT)[number];

export const ESTADOS_INCIDENT = ['PENDIENTE', 'EN_PROCESO', 'RESUELTA'] as const;
export type IncidentStatus = (typeof ESTADOS_INCIDENT)[number];

export const TRANSICIONES_INCIDENT: Record<IncidentStatus, readonly IncidentStatus[]> = {
  PENDIENTE: ['EN_PROCESO'],
  EN_PROCESO: ['RESUELTA'],
  RESUELTA: []
};

export const esPrioridadIncident = (valor: unknown): valor is IncidentPriority =>
  typeof valor === 'string' &&
  (PRIORIDADES_INCIDENT as readonly string[]).includes(valor);

export const esEstadoIncident = (valor: unknown): valor is IncidentStatus =>
  typeof valor === 'string' && (ESTADOS_INCIDENT as readonly string[]).includes(valor);

export interface Incident {
  id: string;
  equipmentId: string;
  reportedBy: string;
  descripcion: string;
  prioridad: IncidentPriority;
  estado: IncidentStatus;
  createdAt: string;
}
