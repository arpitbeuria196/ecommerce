import mongoose from "mongoose";

const connectDB = async ()=>
{
    try 
    {
        mongoose.connect("mongodb+srv://arpit196:arpitbeuria@cluster0.uohce.mongodb.net/EcommerceDB");
        console.log("MongoDB connected");
        
    } catch (error) 
    {
        console.log("connection failed in MongoDB"+error.message);
        process.exit(1);

        
    }
}

export default connectDB;