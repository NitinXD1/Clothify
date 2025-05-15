import { Router } from "express";
import { 
    login,
    logout,
    signup,
    refreshToken,
} from "../controllers/auth.controlller.js";

const router = Router();

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/refresh-token").post(refreshToken)
// router.route("/profile").get(protected , getProfile)

export default router