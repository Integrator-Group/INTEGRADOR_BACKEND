import { Router } from "express";
import { ServiceRatingsController } from "../controllers/serviceRatingsController";
import { validateRatings } from "../middleware/validation";

const router = Router();
const serviceRatingController = new ServiceRatingsController();

router.post('/', validateRatings, serviceRatingController.create);

export default router;