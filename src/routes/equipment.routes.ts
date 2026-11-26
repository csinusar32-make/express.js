import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';
import {
  validateEquipmentIdParameter,
  validateEquipmentMove,
  validateEquipmentPayload,
  validateEquipmentQuery,
  validateEquipmentStatus,
  validateEquipmentUpdate
} from '../middlewares/validateEquipment.middleware';

const router = Router();

router.post('/', validateEquipmentPayload, EquipmentController.createEquipment);
router.get('/', validateEquipmentQuery, EquipmentController.getAllEquipment);
router.get('/:id', validateEquipmentIdParameter, EquipmentController.getEquipmentById);
router.patch('/:id', validateEquipmentIdParameter, validateEquipmentUpdate, EquipmentController.updateEquipment);
router.patch('/:id/move', validateEquipmentIdParameter, validateEquipmentMove, EquipmentController.moveEquipment);
router.patch('/:id/status', validateEquipmentIdParameter, validateEquipmentStatus, EquipmentController.setEquipmentStatus);

export default router;
