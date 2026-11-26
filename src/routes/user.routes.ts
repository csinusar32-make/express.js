import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import {
  validateUserActive,
  validateUserIdParameter,
  validateUserPayload,
  validateUserQuery,
  validateUserUpdate
} from '../middlewares/validateUser.middleware';

const router = Router();

router.post('/', validateUserPayload, UserController.createUser);
router.get('/', validateUserQuery, UserController.getAllUsers);
router.get('/:id', validateUserIdParameter, UserController.getUserById);
router.patch('/:id', validateUserIdParameter, validateUserUpdate, UserController.updateUser);
router.patch('/:id/active', validateUserIdParameter, validateUserActive, UserController.setUserActive);

export default router;
