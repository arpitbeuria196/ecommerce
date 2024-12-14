import Product from "../model/productModel"
export const addToCart = async (req,res)=>
{
     try {
        
        const{productId} = req.body;


        const user = req.user;

        const existingProduct = user.cartItems.find((item)=> item.id === productId);

        if(existingProduct)
        {
            existingProduct.quantity+=1;
        }
        else
        {
            user.cartItems.push(productId); 
        }

        await user.save();
        res.json(user.cartItems);

     } catch (error) {
        
        console.log("Error in addToCart controller",error.message);
        res.status(500).json({message: "Server error",error: error.message}); 

     }
};

export const removeAllFromCart = async (req,res)=>
    {
         try {
            
            const{productId} = req.body;
    
    
            const user = req.user;
    
            if(!productId)
            {
               user.cartItems=[];
            }
            else
            {
                user.cartItems = user.cartItems.filter((item)=> item.id!=productId);
            }
    
            await user.save();
            res.json(user.cartItems);
    
         } catch (error) {
            
            console.log("Error in remove All Carts controller",error.message);
            res.status(500).json({message: "Server error",error: error.message}); 
    
         }
};

export const updateQuantity = async (req,res)=>
{
    try {
        const{id:productId} = req.params;
        const{quantity} = req.body;
        const user = req.user;
        const existingProduct = user.cartItems.find((cart)=> productId== cart.id);

        if(existingProduct)
        {
            if(quantity == 0)
            {
                user.cartItems = user.cartItems.filter((cart)=> cart.id!= productId);
                await user.save();
                return res.json(user.cartItems);
            }
            existingProduct.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        }
        else
        {
            res.status(500).json({message: "Product Not Found"});
        }
        
    } catch (error) {
        res.status(404).json({message: "Error while updating quantity",error: error.message});
    }
}
export const getCartProducts = async (req,res)=>
{
    try {
        const products = await Product.find({_id:{$in:req.user.cartItems}});

        const cartItems = products.map( product =>{
            const item = req.user.cartItems.filter(cartItem => cartItem.id == product.id);
            return {...product.toJSON(),quantity:item.quantity}
        })
    } catch (error) {
     res.status(500).json({message:"Server Error while fetching Cart Products!!"});   
    }
}



 
    