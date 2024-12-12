import express from "express";
import { createProduct, getAllProducts,getFeaturedProducts,getRecommendedProducts,deleteProduct,getProductsByCategory,getProductsByCategory,togleFeaturedProduct } from "../controllers/productController";

const router = express.Router();

router.get("/",protectRoute,adminRoute,getAllProducts);
router.get("/featured",getFeaturedProducts);
router.get("/category/:category",getProductsByCategory)
router.get("/recommendations",getRecommendedProducts)
router.post("/",protectRoute,adminRoute, createProduct);
router.patch("/:id",protectRoute,adminRoute,togleFeaturedProduct)
router.delete("/:id",protectRoute,adminRoute, deleteProduct);


export default router