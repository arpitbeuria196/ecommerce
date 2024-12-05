import { redis } from "../redis/redis.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET || "defaultSecret";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, secret, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, secret, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: "User created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const signin = async (req,res)=>
{
    try 
    {
        const {email,password} = req.body;
        
        const existUser = await User.findOne({email});
        if(existUser && await User.comparePassword(password))
        {
            const {accessToken,refreshToken} = generateTokens(existUser._id);

            await storeRefreshToken(existUser._id,refreshToken);
            setCookies(res,accessToken,refreshToken);

            res.json({
                _id: existUser._id,
                name: existUser.name,
                email: existUser.email,
                role:  existUser.role
            });
        }
        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const signout = async (req,res)=>
{
   try 
   {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken)
    {
        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET);
        console.log(decoded);
        await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookies("accessToken");
    res.clearCookies("refreshToken");
    res.json({message:"Loggedout successfully"});
    
   } catch (error) {
        res.status(500).json({message:"Server Error"});
   }
}