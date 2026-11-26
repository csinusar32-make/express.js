import {
  DashboardIncidents,
  DashboardRoomDetail,
  DashboardSummary
} from '../dtos/dashboard.dto';
import { DomainError } from '../errors/domain.error';
import { DashboardRepository } from '../repositories/dashboard.repository';

export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  public getSummary(): Promise<DashboardSummary> {
    return this.dashboardRepository.summary();
  }

  public async getRoomDetail(roomId: string): Promise<DashboardRoomDetail> {
    const detalle = await this.dashboardRepository.roomDetail(roomId);
    if (!detalle) {
      throw new DomainError('NOT_FOUND', `No existe un ambiente con identificador ${roomId}.`);
    }
    return detalle;
  }

  public getIncidents(): Promise<DashboardIncidents> {
    return this.dashboardRepository.openIncidents();
  }
}
