import { Router } from "express";
import { MessagingsController } from "../controllers/messagingsController";
import { validateMessagings } from "../middleware/validation";

const router = Router();
const messagingsController = new MessagingsController();

// Listado para enviados
router.get('/sender/:sender_id', messagingsController.getAllBySender);

//Listado para enviados eliminados
router.get('/sender/deleted/:sender_id', messagingsController.getAllBySenderDeleted);

// Listado para recibidos
router.get('/receiver/:receiver_id', messagingsController.getAllByReceiver);

// Listado para recibidos eliminados
router.get('/receiver/deleted/:receiver_id', messagingsController.getAllByReceiverDeleted)

// Enviar mensaje
router.post('/', validateMessagings, messagingsController.create);

// Actualizar si se elimina
router.put('/:id', messagingsController.update);

export default router;