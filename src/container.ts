import { prisma } from './db/prisma';
import { PrismaDashboardRepository } from './repositories/dashboard.repository';
import { PrismaEquipmentRepository } from './repositories/prisma-equipment.repository';
import { PrismaIncidentRepository } from './repositories/prisma-incident.repository';
import { PrismaLoanRepository } from './repositories/prisma-loan.repository';
import { PrismaRoomRepository } from './repositories/prisma-room.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { DashboardService } from './services/dashboard.service';
import { EquipmentService } from './services/equipment.service';
import { IncidentService } from './services/incident.service';
import { LoanService } from './services/loan.service';
import { RoomService } from './services/room.service';
import { UserService } from './services/user.service';

const userRepository = new PrismaUserRepository(prisma);
const roomRepository = new PrismaRoomRepository(prisma);
const equipmentRepository = new PrismaEquipmentRepository(prisma);
const loanRepository = new PrismaLoanRepository(prisma);
const incidentRepository = new PrismaIncidentRepository(prisma);
const dashboardRepository = new PrismaDashboardRepository(prisma);

export const userService = new UserService(userRepository);
export const roomService = new RoomService(roomRepository, equipmentRepository);
export const equipmentService = new EquipmentService(equipmentRepository, roomRepository);
export const loanService = new LoanService(loanRepository, roomRepository, userRepository);
export const incidentService = new IncidentService(
  incidentRepository,
  equipmentRepository,
  userRepository
);
export const dashboardService = new DashboardService(dashboardRepository);
