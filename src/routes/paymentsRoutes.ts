import { Router } from "express";
import { PaymentsController } from "../controllers/paymentsController";
import { validatePayments } from "../middleware/validation";

const router = Router();
const paymentsController = new PaymentsController();

router.post('/', validatePayments, paymentsController.create);
router.put('/:id', paymentsController.update);

export default router;