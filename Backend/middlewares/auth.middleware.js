import { User } from "../models/user.model.js"
import jwt from 'jsonwebtoken'

export const protectRoute = async (req,res,next) => {
    try {
        
        const accessToken = req.cookies.accessToken

        if(!accessToken){
            return res.status(401).json({message : "Unauthorized request :- no access token available"})
        }

        try {
            const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decodedToken.id)
    
            if(!user){
                return res.status(401).json({message : "Unauthorized request :- User not found"})
            }
            
            req.user = user;
    
            next()

        } catch (error) {
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({message : "Access token expired"})
            }
            throw error
        }

    } catch (error) {
        console.log("Error in protectRoute middleware")
        return res.status(401).json({message : "Unauthorized request :- Invalid access token"})
    }
}

export const adminRoute = async (req,res,next) => {
    const user = req.user

    if(!user){
        return res.status(401).json({
            message : "Unauthorized request"
        })
    }

    if(user.role === "admin"){
        next()
    }
    else{
        return res.status(403).json({message : "Access denied - admin only"})
    }
}