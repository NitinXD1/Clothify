import { redis } from "../lib/redis.js";
import { Product } from "../models/product.model.js";

export const getAllProducts = async (req,res) => {
    try {
        //can leave the find() like this but to be sure we can pass an empty object
        const products = await Product.find({});
        res.status(201).json({products})

    } catch (error) {
        console.log("Error in getAllProducts controller")
        return res.status(500).json({message : "Internal Server Error"});
    }
}

export const getFeaturedProducts = async(req,res) =>{
    try {
        
        let featuredProducts = await redis.get("featured_products")

        if(featuredProducts){
            return res.status(201).json(JSON.parse(featuredProducts))
        }
        
        //.lean is helpful in getting the data in plain JS objects instead of mongodb objects
        //performance improves
        featuredProducts = await Product.find({isFeatured:true}).lean()

        if(!featuredProducts){
            return res.status(404).json({message : "No featured products available"})
        }

        await redis.set("featured_products",JSON.stringify(featuredProducts))

        return res.status(201).json(featuredProducts)

    } catch (error) {
        console.log("Error in getFeaturedProducts controller",error.message)
        return res.status(500).json({message : "Server error",error : error.message})
    }
}