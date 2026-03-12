import { Router } from "express";
import { CustomerLoyaltyController } from "../controllers/customerLoyaltyController";

const router = Router();
const controller = new CustomerLoyaltyController();

router.get("/user/:id_user", controller.getByUser);
router.post("/earn", controller.earn); // { id_user, amount, reason? }
router.put("/user/:id_user", controller.setPoints); // { points }

export default router;

