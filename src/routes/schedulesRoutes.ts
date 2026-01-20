import { Router } from "express";
import { SchedulesController } from "../controllers/schedulesController";
import { validateSchedules, validateSchedulesUpdate } from "../middleware/validation";

const router = Router();
const scheduleController = new SchedulesController();

router.get("/", scheduleController.findAll);
router.post("/", validateSchedules, scheduleController.create);
router.put("/:id", validateSchedulesUpdate, scheduleController.update);

export default router;