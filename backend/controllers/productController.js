import { redis } from "../redis/redis.js";
import Product from "../model/productModel.js";
import cloudinary from "../lib/cloudinary.js";


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

export const createProduct = async (req,res)=>
{
    try {
        const{name,description,price,image,category} = req.body;

        let cloudinaryResponse = null;

        if(image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image,{folder: "products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        }) 
        
        res.status(201).json(product)
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({message: "Server Error",error : error.message});
    }
}

export const deleteProduct = async (req,res)=>
{
    try {
        const product = await Product.findById(req.params.id);

        if(!product)
        {
          return  res.status(400).json({message:"Producct is not found"});
        }

        if(product.image)
        {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("deleted image from cloudinary");
            } catch (error) {

                console.log("error deleting image from cloudinary",error);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({message: "Product deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error",error : error.message})
    }
}

export const getRecommendedProducts = async (req,res)=>
{
    try {
       const products = await Product.aggregate([
        {
            $sample: {size:3}
        },
        {
            $project:
            {
                _id:1,
                name:1,
                description:1,
                image:1,
                price:1
            }
        }
       ]) 

       res.json(products);
    } catch (error) {
        res.status(500).json({message:""})
    }
}

export const getProductsByCategory = async (req,res)=>
{
    const {category} = req.params;

    try {
        const products = await Product.find({category});
        res.json({products});
    } catch (error) {
        res.status(500).json({message: "Server error",error: error.message});
    }
}

export const togleFeaturedProduct = async (req,res)=>
{
    try {
        const product = await Product.findById(req.params.id);
        if(product)
        {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await Product.save();
            await updateFeaturedProductCache();
            res.json(updatedProduct);
        }
        else
        {
            res.status(404).json({message: "Product Not Found"});
        }
        
    } catch (error) {
        res.status(500).json({message: "Server error",error: error.message});
    }
}

async function updateFeaturedProductCache() {
    try {
        
        const featuredProducts = await Product.find({isFeatured: true}).lean();
        await redis.set("featured_products",JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("error in update cache function");
        res.status(400).JSON({message:"Unable to updateFeature",error:error.message});
}
}





