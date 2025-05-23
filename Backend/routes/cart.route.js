import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { 
    addToCart , 
    removeAllFromCart,
    updateQuantity,
    getCartProducts
 } from "../controllers/cart.controller.js";

const router = Router()

router.route("/").get(protectRoute , getCartProducts)
router.route("/").post(protectRoute , addToCart)
router.route("/").delete(protectRoute , removeAllFromCart)
router.route("/:id").put(protectRoute , updateQuantity)

export default router