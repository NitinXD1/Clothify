import {Router} from 'express'
import { getAllProducts, getFeaturedProducts } from '../controllers/product.controller.js'
import { protectRoute , adminRoute } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/").get(protectRoute , adminRoute , getAllProducts)
router.route("/featured").get(getFeaturedProducts)

export default router