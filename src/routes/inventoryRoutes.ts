import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController';
import { validateInventory, validateInventoryUpdate } from '../middleware/validation';

const router = Router();
const inventoryController = new InventoryController();

router.get('/', inventoryController.getAll);
router.get('/branch/:id_branch', inventoryController.getByBranch);
router.get('/:id', inventoryController.getById);
router.post('/', validateInventory, inventoryController.create);
router.put('/:id', validateInventoryUpdate, inventoryController.update);
router.delete('/:id', inventoryController.delete);

export default router;
