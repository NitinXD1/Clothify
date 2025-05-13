import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controlller.js";

const router = Router();

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").post(logout)

export default router