import { Router } from "express";
import { NotificationsController } from "../controllers/notificationsController";
import { validateNotifications } from "../middleware/validation";

const router = Router();
const notificationsController = new NotificationsController();

// Listar notificaciones por usuario
router.get('/:id_user', notificationsController.findAllByUser);

router.post('/', validateNotifications, notificationsController.create);
router.put('/:id', notificationsController.update);

export default router;