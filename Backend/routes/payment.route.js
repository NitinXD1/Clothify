import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createCheckoutSession , checkoutSuccess } from "../controllers/payment.controller.js";

const router = Router()

router.route("/create-checkout-session").post(protectRoute , createCheckoutSession)
router.route("/checkout-success").post(protectRoute , checkoutSuccess)

export default router