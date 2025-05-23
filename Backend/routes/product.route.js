import {Router} from 'express'
import { 
    getAllProducts,
    getFeaturedProducts ,
    createProduct ,
    deleteProduct ,
    getRecommendedProducts,
    getProductByCategory,
    toggleFeaturedProduct
} from '../controllers/product.controller.js'
import { protectRoute , adminRoute } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/").get(protectRoute , adminRoute , getAllProducts)
router.route("/featured").get(getFeaturedProducts)
router.route("/recommendations").get(protectRoute , getRecommendedProducts)
router.route("/category/:category").get(getProductByCategory)
router.route("/").post(protectRoute , adminRoute , createProduct)
router.route("/:id").delete(protectRoute , adminRoute , deleteProduct)
router.route("/:id").patch(protectRoute , adminRoute , toggleFeaturedProduct)


export default router