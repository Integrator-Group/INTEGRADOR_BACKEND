import { Router } from 'express';
import { UsersController } from '../controllers/usersController';
import { validateUser, validateUserUpdate } from '../middleware/validation';

const router = Router();
const usersController = new UsersController();

router.get('/role/:id_role', usersController.getByRole);
router.get('/:id', usersController.getById);
router.post('/', validateUser, usersController.create);
router.put('/:id', validateUserUpdate, usersController.update);
router.delete('/:id', usersController.delete);

export default router;

