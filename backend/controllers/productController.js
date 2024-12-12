import { redis } from "../redis/redis.js";
import Product from "../model/productModel";


export const getAllProducts = async (req,res)=>
{
    try {
        const products = await Product.find({});
        res.json({products});
        
    } catch (error) 
    {
        console.log("Error in getAllProducts controller",error.message);
        res.status(400).json({message:"Server Error",error: error.message});        
    }
}

export const getFeaturedProducts = async (req,res)=>
{
    try {

        let featuredProducts = await redis.get("featured_products");

        if(featuredProducts)
        {
            res.status(200).json(JSON.parse(featuredProducts));
        }

        //return a plain js object instead of a mongoDB document
        featuredProducts = await  Product.find({isFeatured: true}).lean();

        if(!featuredProducts)
        {
            return  res.status(400).json({message: "No Featured products found"});
        }
        //store in redis for future quick access

        await redis.set("featured_products",JSON.stringify(featuredProducts));

        res.json(featuredProducts);

        
    } catch (error) {
        console.log("Error in getFeaturedProducts controller",error.message);

        res.status(500).json({message: "Server Error",error: error.message});
    }
}

