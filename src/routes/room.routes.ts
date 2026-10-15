import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';

const router = Router();

router.get('/', RoomController.getAllRooms);
router.post('/', RoomController.createRoom);
router.patch('/:id', RoomController.updateRoom);

export default router;
