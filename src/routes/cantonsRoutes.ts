import { Router } from 'express';
import { CantonsController } from '../controllers/cantonsController';
import { validateCanton, validateCantonUpdate } from '../middleware/validation';

const router = Router();
const cantonsController = new CantonsController();

router.get('/', cantonsController.getAll);
router.get('/province/:id_province', cantonsController.getByProvince);
router.get('/:id', cantonsController.getById);
router.post('/', validateCanton, cantonsController.create);
router.put('/:id', validateCantonUpdate, cantonsController.update);
router.delete('/:id', cantonsController.delete);

export default router;

