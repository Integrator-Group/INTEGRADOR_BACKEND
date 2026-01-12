import { Router } from "express";
import { AreasController } from "../controllers/areasController";
import { validateAreas, validateAreasUpdate } from "../middleware/validation";

const router = Router();
const areaController = new AreasController();

router.get("/", areaController.getAll);
router.get("/by-branch", areaController.getByBranch);
router.get("/by-area", areaController.getBranchByArea);
router.post("/", validateAreas, areaController.create);
router.put("/:id", validateAreasUpdate, areaController.update);
router.delete("/:id", areaController.delete);

export default router;