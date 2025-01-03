import Coupon from "../model/couponModel.js";

export const getCoupon = async (req,res)=>
{
    try {
        const coupon = await Coupon.findOne({userId: req.user._id,isActive:true});
        res.json(coupon || null);
    } catch (error) {
        res.status(500).json({message: "Server Error",error: error.message});
    }
}

export const validateCoupon = async (req,res)=>
{
    try {
        const {code} = req.body;

        const coupon = await Coupon.find({code:code,userId:req.user._id,isActive:true});
        
        if(!coupon)
        {
                return res.status(404).json({message:"Coupon doesn't found"});
        }

        if(coupon.expirationDate < new Date())
        {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({message: "Coupon expired"});
        }

        res.json({
            message: "Coupon is Valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        })

        
    } catch (error) {
        res.status(500).json({message:"Coupon error",error:error.message});
    }
}