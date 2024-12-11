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