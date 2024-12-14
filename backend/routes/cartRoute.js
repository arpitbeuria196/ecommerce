import express from "express";
import { addToCart,removeAllFromCart,updateQuantity,getCartProducts } from "../controllers/cartController";
import protectRoute from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/",protectRoute,getCartProducts);
router.post("/",protectRoute,addToCart);
router.delete("/",protectRoute,removeAllFromCart);
router.put("/:id",protectRoute,updateQuantity);

export default router