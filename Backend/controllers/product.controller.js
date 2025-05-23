import { redis } from "../lib/redis.js";
import { Product } from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

const updateFeaturedProductCache = async () =>{
    try {
        
        const featuredProducts = await Product.find({isFeatured : true}).lean();

        await redis.set("featuredProducts", JSON.stringify(featuredProducts));

    } catch (error) {
        console.log("Error in updating redis cache function")
    }
}

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
            return res.status(202).json(JSON.parse(featuredProducts))
        }

        //.lean is helpful in getting the data in plain JS objects instead of mongodb objects
        //performance improves
        featuredProducts = await Product.find({isFeatured:true}).lean()

        if(!featuredProducts){
            return res.status(403).json({message : "No featured products available"})
        }

        await redis.set("featured_products",JSON.stringify(featuredProducts))

        return res.status(201).json(featuredProducts)

    } catch (error) {
        console.log("Error in getFeaturedProducts controller",error.message)
        return res.status(500).json({message : "Server error",error : error.message})
    }
}

export const createProduct = async(req,res) => {
    try {
        const { name , price , description ,category , image} = req.body

        if ([name, price, description, category].some(field => typeof field === 'string' ? field.trim() === "" : field === undefined || field === null)) {
            return res.status(400).json({ message: "All fields are necessary and mandatory" });
        }

        let cloudinaryResponse = null

        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image,{folder : "products"})
        }

        const product = await Product.create(
            {
                name,
                price,
                image : cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "",
                description,
                category,
            }
        )

        return res.status(201).json(
            {
                message : "Product created successfully",
                product
            }
        )

    } catch (error) {
        console.log("Error in product creation controller",error.message)
        return res.status(500).json({message : "Server Error",error : error.message})
    }
}

export const deleteProduct = async(req,res) => {
    try {
        const id = req.params.id
    
        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({message : "Product not found"})
        }

        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0]
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("Cloudinary image deleted")
            } catch (error) {
                console.log("Error in deleting the cloudinary image")
            }
        }

        await Product.findByIdAndDelete(req.params.id)
    
        return res.status(200).json({message : "Product deleted successfully"})
    } catch (error) {
        console.log("Error in delete product controller")
        return res.status(500).json({message:"Internal Server Error",error : error.message})
    }
}

export const getRecommendedProducts = async(req,res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample : {
                    size : 3
                }
            },
            {
                $project : {
                    _id : 1,
                    name : 1,
                    price : 1,
                    image : 1,
                    description : 1,
                }
            }
        ])
    
        res.status(200).json(products)
    } catch (error) {
        console.log("error in the get recommended products controller")
        return res.status(500).json(
            {
                message : "Server side Error",
                error : error.message
            }
        )
    }
}

export const getProductByCategory = async(req,res) => {
    try {
        const {category} = req.params
    
        const products = await Product.find({category})
    
        return res.status(200).json({products})
    } catch (error) {
        console.log("Error in getting Products by category controller")
        return res.status(500).json({message : "Internal Server Error",error : error.message})
    }
}

export const toggleFeaturedProduct = async (req,res) => {
    try {

        const id = req.params.id

        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({
                message : "Product doesnt exists"
            })
        }

        product.isFeatured = !product.isFeatured

        const updatedProduct = await product.save()

        await updateFeaturedProductCache()

        return res.status(200).json(
            {   product : updatedProduct,
                message : "Featured updated successfully"
            }
        )

    } catch (error) {
        
        console.log("Error in toggle Featured controller",error.message)
        return res.status(500).json({
            message : "Internal Server Error",
            error : error.message
        })

    }
}