import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import {
  validateRoomIdParameter,
  validateRoomPayload,
  validateRoomQuery,
  validateRoomStatus,
  validateRoomUpdate
} from '../middlewares/validateRoom.middleware';

const router = Router();

router.post('/', validateRoomPayload, RoomController.createRoom);
router.get('/', validateRoomQuery, RoomController.getAllRooms);
router.get('/:id', validateRoomIdParameter, RoomController.getRoomById);
router.patch('/:id', validateRoomIdParameter, validateRoomUpdate, RoomController.updateRoom);
router.patch('/:id/status', validateRoomIdParameter, validateRoomStatus, RoomController.setRoomStatus);

export default router;
