import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getCoupons , validateCoupon } from "../controllers/coupon.controller.js";

const router = Router()

router.route("/").get(protectRoute , getCoupons)
router.route("/validate").post(protectRoute , validateCoupon)

export default router