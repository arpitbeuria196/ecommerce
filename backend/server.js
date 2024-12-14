import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js"
import connectDB from "./lib/db.js"
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoute.js"
import couponRoutes from "./routes/couponRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"


dotenv.config();

const app = express();

//Parse the body of the request
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupons",couponRoutes);
app.use("/api/payments",paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await connectDB();
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); 
    }
});