import { Router } from "express";
import { SpecialtiesController } from "../controllers/specialtiesController";
import { validateSpecialties, validateSpecialtiesUpdate } from "../middleware/validation";

const router = Router();
const specialtiesController = new SpecialtiesController();

router.get("/", specialtiesController.getAll);
router.get("/by-branch-area", specialtiesController.getByBranchAndArea);
router.post("/", validateSpecialties, specialtiesController.create);
router.put("/:id", validateSpecialtiesUpdate, specialtiesController.update);
router.delete("/:id", specialtiesController.delete);

export default router;