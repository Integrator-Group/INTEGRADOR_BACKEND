import { Router } from 'express';
import { ProvincesController } from '../controllers/provincesController';
import { validateProvince, validateProvinceUpdate } from '../middleware/validation';

const router = Router();
const provincesController = new ProvincesController();

router.get('/', provincesController.getAll);
router.get('/:id', provincesController.getById);
router.post('/', validateProvince, provincesController.create);
router.put('/:id', validateProvinceUpdate, provincesController.update);
router.delete('/:id', provincesController.delete);

export default router;

