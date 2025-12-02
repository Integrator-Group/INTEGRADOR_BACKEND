import { Router } from 'express';
import { CredentialsController } from '../controllers/credentialsController';
import { validateLogin, validateCredentialsUpdate } from '../middleware/validation';

const router = Router();
const credentialsController = new CredentialsController();

router.post('/login', validateLogin, credentialsController.login);
router.put('/:id', validateCredentialsUpdate, credentialsController.update);
router.delete('/:id', credentialsController.delete);

export default router;

