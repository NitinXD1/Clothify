import { Product } from "../models/product.model.js"

export const addToCart = async(req,res) => {
    try {
        const {productId} = req.body
        const user = req.user

        const existingItem = user.cartItems.find( (item) => item.product.toString() === productId)
        if(existingItem){
            existingItem.quantity += 1;
        }
        else{
            user.cartItems.push({product : productId})
        }

        await user.save()

        return res.status(200).json({
            message : "Item added to Cart Successfully",
            cartItems : user.cartItems
        })

    } catch (error) {
        
        console.log("Something went wrong with the add to cart controller",error.message)
        return res.status(500).json({message : "Internal Server Error",error : error.message})

    }
}

export const removeAllFromCart = async(req,res) => {
    try {
            const {productId} = req.body
            const user = req.user
        
            if(productId){
                user.cartItems = user.cartItems.filter( (item) => { return item.product.toString() !== productId } )
            }
        
            await user.save()
        
            return res.status(200).json({message : "Product removed from cart successfully"})
    } catch (error) {

        console.log("Something went wrong with the delete from cart controller",error.message)
        return res.status(500).json({message : "Internal Server Error",error : error.message})

    }
}

export const updateQuantity = async(req,res) => {
    try {
        const {id : productId} = req.params
        const {quantity} = req.body
        const user = req.user
    
        let existingItem = user.cartItems.find((item) => item.product.toString() === productId)
    
        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId)
                await user.save()
                return res.status(200).json(user.cartItems)
            }

            existingItem.quantity = quantity;
            await user.save()

            return res.status(200).json(user.cartItems)
        }
        else{
            return res.status(404).json({message : "Product not found"})
        }
    } catch (error) {
        console.log("Error in update quantity controller",error.message)
        return res.status(500).json({message : "Server Error",error : error.message})
    }
}

export const getCartProducts = async(req,res) => {
    //can also use populate for easier implementation
    try {   
        const productIds = req.user.cartItems.map(item => item.product);
        const products = await Product.find({_id : {$in : productIds}});
        
        const cartItems = products.map( (product) => {
            const item = req.user.cartItems.find( cartItem => cartItem.product.toString() === product._id.toString() )
            return {...product.toJSON() ,quantity : item.quantity}
        } )

        res.status(200).json({cartItems})

    } catch (error) {
        console.log("Error in getting all the cart Items controller",error.message)
        return res.status(500).json({message : "Server Error",error : error.message})
    }
}