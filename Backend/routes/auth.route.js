import { Router } from "express";
import { 
    login,
    logout,
    signup,
    refreshToken,
    getProfile
} from "../controllers/auth.controlller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/refresh-token").post(refreshToken)
router.route("/profile").get(protectRoute , getProfile)

export default router