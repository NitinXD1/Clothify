import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controlller.js";

const router = Router();

router.route("/signup").post(signup)
router.route("/login").get(login)
router.route("/logout").get(logout)

export default router