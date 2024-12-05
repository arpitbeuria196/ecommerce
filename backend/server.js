import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js"
import connectDB from "./lib/db.js"

dotenv.config();

const app = express();



app.use("/auth".authRoutes)
//Parse the body of the request
app.use(express.json());


app.listen(process.env.PORT,()=>
{
    console.log("Server is running on port 5000");
    connectDB();
})