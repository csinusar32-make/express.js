import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import { validateRoomPayload } from '../middlewares/validateRoom.middleware';

const router = Router();

router.get('/', RoomController.getAllRooms);
router.post('/', validateRoomPayload, RoomController.createRoom);
router.patch('/:id', RoomController.updateRoom);

export default router;
