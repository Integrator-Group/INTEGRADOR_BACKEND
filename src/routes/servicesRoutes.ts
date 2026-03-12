import { Router } from "express";
import { ServicesController } from "../controllers/servicesController";
import { validateService, validateServiceUpdate } from "../middleware/validation";

const router = Router();
const servicesController = new ServicesController();

router.get("/", servicesController.getAll);
router.get("/area/:id_area", servicesController.getByArea);
router.get("/:id_branch", servicesController.getByBranch);
router.post("/", validateService, servicesController.create);
router.put("/:id", validateServiceUpdate, servicesController.update);
router.delete("/:id", servicesController.delete);

export default router;