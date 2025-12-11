import { Router } from "express";
import { NotificationPreferencesController } from "../controllers/notificationPreferencesController";

const router = Router();
const notificationPreferencesController = new NotificationPreferencesController();

router.get('/:id_user', notificationPreferencesController.getByUser);
router.patch('/:id_user', notificationPreferencesController.savePreferences);

export default router;