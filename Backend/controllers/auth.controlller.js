import { User } from "../models/user.model.js";

export const signup = async (req,res) =>{
    try {
        const {username , email , password} = req.body;
    
        const userExists = await User.findOne({email})
    
        if(userExists){
            return res.status(400).json(
                {
                    message : "User Already Exists"
                }
            )
        }
    
        const user = await User.create({
            username,
            password,
            email,
        })
    
        res.status(201).json(
            {
                user,
                message : "User created Successfully"
            }
        )
    } catch (error) {
        return res.status(401).json({
            message : "Error while registering the user"
        })
    }
}
export const login = async (req,res) =>{
    res.send("User called Login function")
}
export const logout = async (req,res) =>{
    res.send("User called LOgout function")
}

