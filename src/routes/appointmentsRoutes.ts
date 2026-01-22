import { Router } from "express";
import { AppointmentsController } from "../controllers/appointmentsController";

const router = Router();
const appointmentsController = new AppointmentsController();

router.get('/', appointmentsController.getAll);
router.get('/user/:id_user', appointmentsController.getAllByUser)
router.get('/professional/:id_professional', appointmentsController.getAllByProffesional)

export default router;