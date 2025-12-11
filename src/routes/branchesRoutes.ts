import { Router } from "express";
import { BranchesController } from "../controllers/branchesController";
import { validateBranche, validateBrancheUpdate } from "../middleware/validation";

const router = Router();
const branchesController = new BranchesController();

router.get("/", branchesController.getAll);
router.get("/location", branchesController.getByProvinceCantons);
router.post("/", validateBranche, branchesController.create);
router.put("/:id", validateBrancheUpdate, branchesController.update);
router.delete("/:id", branchesController.delete);

export default router;