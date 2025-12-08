import { Router } from "express";
import { ItemsController } from "../controllers/itemsController";
import { validateItems, validateItemsUpdate } from "../middleware/validation";

const router = Router();
const itemsController = new ItemsController();

router.get('/', itemsController.getAll);
router.post('/',validateItems, itemsController.create);
router.put('/:id',validateItemsUpdate, itemsController.update);
router.put('/:id',itemsController.delete);

export default router;