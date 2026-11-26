import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { validateDashboardRoomIdParameter } from '../middlewares/validateDashboard.middleware';

const router = Router();

router.get('/summary', DashboardController.getSummary);
router.get('/rooms/:id', validateDashboardRoomIdParameter, DashboardController.getRoomDetail);
router.get('/incidents', DashboardController.getIncidents);

export default router;
