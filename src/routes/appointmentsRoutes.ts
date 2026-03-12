import { Router } from "express";
import { AppointmentsController } from "../controllers/appointmentsController";
import { validateAppointments } from "../middleware/validation";

const router = Router();
const appointmentsController = new AppointmentsController();

router.get('/', appointmentsController.getAll);
// Listado para Usuarios
router.get('/user/:id_user', appointmentsController.getAllByUser)
router.get('/scheduled/user/:id_user', appointmentsController.getScheduledByUser)
router.get('/filled/user/:id_user', appointmentsController.getFilledByUser)
router.get('/canceled/user/:id_user', appointmentsController.getCanceledByUser)

// Listado para Profesionales
router.get('/professional/:id_professional', appointmentsController.getAllByProfessional)
router.get('/scheduled/professional/:id_professional', appointmentsController.getScheduledByProfessional)
router.get('/filled/professional/:id_professional', appointmentsController.getFilledByProfessional)
router.get('/canceled/professional/:id_professional', appointmentsController.getCanceledByProfessional)

// Agendar cita
router.post('/', validateAppointments, appointmentsController.create);

//Actualizar cita
router.put('/:id', appointmentsController.update);

// Cancelar cita y reversar pago
router.put('/:id/cancel', appointmentsController.cancel);

export default router;