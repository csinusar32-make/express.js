import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller';
import {
  validateIncidentIdParameter,
  validateIncidentPayload,
  validateIncidentQuery,
  validateIncidentStatus
} from '../middlewares/validateIncident.middleware';

const router = Router();

router.post('/', validateIncidentPayload, IncidentController.createIncident);
router.get('/', validateIncidentQuery, IncidentController.getAllIncidents);
router.get('/:id', validateIncidentIdParameter, IncidentController.getIncidentById);
router.patch('/:id/status', validateIncidentIdParameter, validateIncidentStatus, IncidentController.changeIncidentStatus);

export default router;
