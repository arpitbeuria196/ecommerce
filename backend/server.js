import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js"
import connectDB from "./lib/db.js"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

//Parse the body of the request
app.use(express.json());
app.use(cookieParser());


app.use("/auth",authRoutes)

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