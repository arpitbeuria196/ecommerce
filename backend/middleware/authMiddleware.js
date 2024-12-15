import jwt from "jsonwebtoken";
import User from "../model/userModel.js";


export const protectRoute = async (req,res)=>
{
    try 
    {
        const accessToken = req.cookie.accessToken;

        if(!accessToken)
        {
            return res.status(400).json({message: "Unauthorized - No access token provided"})
        }

        const decoded = jwt.verify(accessToken,process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user)
        {
            return res.status(401).json({message: "User Not Found"});
        }

        req.user = user;

        next();
        
    } catch (error) {

        return res.status(400).json({message:"Unauthorized access-Invalid Token",error:error.message})
        
    }
}

export const adminRoute = async (req,res)=>
{
    if(req.user && req.user.role == "admin")
    {
        next();
    }else
    {
        return res.status(403).json({message: "Access Denied Admin Only"});
    }
}