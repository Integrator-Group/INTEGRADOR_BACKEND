import { Router } from "express";
import { SchedulesController } from "../controllers/schedulesController";
import { validateSchedules, validateSchedulesUpdate } from "../middleware/validation";

const router = Router();
const scheduleController = new SchedulesController();

router.get("/", scheduleController.findAll);
router.get("/user/:id_user/day/:day", scheduleController.findByUser);
router.get("/area/:id_area/day/:day", scheduleController.findByArea);
router.post("/", validateSchedules, scheduleController.create);
router.put("/:id", validateSchedulesUpdate, scheduleController.update);
router.delete("/:id", scheduleController.delete);

export default router;