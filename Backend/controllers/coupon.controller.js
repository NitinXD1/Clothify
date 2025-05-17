import Coupon from "../models/coupon.model.js"

export const getCoupons = async(req,res) =>{
    try {
        
        const coupons = await Coupon.find({userId : req.user._id,isActive : true})
        return res.status(200).json(coupons)

    } catch (error) {
        console.log("Error in getting allCoupons controller",error.message)
        return res.status(500).json({
            message : "Internal Server Error",
            error : error.message
        })
    }
}

export const validateCoupon = async(req,res) => {
    try {
        const {code} = req.body

        const coupon = await Coupon.findOne({code,userId:req.user._id,isActive:true})

        if(!coupon){
            return res.status(404).json({message : "Not a valid coupon"})
        }

        if(coupon.expirationDate < new Date()){
            coupon.isActive = false;
            await coupon.save()
            return res.status(404).json({message : "Coupon is expired"})
        }

        return res.status(200).json({
            message : "Coupon is valid",
            code : coupon.code,
            discountPercentage : coupon.discountPercentage
        })

    } catch (error) {
        console.log("Error in validating the coupon controller",error.message)
        return res.status(500).json({
            message : "Internal Server Error",
            error : error.message
        })
    }
}