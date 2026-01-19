import { Router } from 'express';
import { PaymentStatusController } from '../controllers/paymentStatusController';
import { validatePaymentStatus, validatePaymentStatusUpdate } from '../middleware/validation';

const router = Router();
const paymentStatusController = new PaymentStatusController();

router.get('/', paymentStatusController.getAll);
router.get('/:id', paymentStatusController.getById);
router.post('/', validatePaymentStatus, paymentStatusController.create);
router.put('/:id', validatePaymentStatusUpdate, paymentStatusController.update);
router.delete('/:id', paymentStatusController.delete);

export default router;

