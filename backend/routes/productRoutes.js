import express from "express";
import { getAllProducts } from "../controllers/productController";

const router = express.Router();

router.get("/",protectRoute,adminRoute,getAllProducts);
router.get("/featured",getFeaturedProducts);
router.post("/",protectRoute,adminRoute, createProduct);



export default router