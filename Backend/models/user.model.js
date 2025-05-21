import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";

import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        name : {
            type : String,
            required : [true,"Name is Required"],
        },
        email : {
            type : String,
            required : [true,"Email is required"],
            unique : true,
            lowercase : true,
            trim : true,
        },
        password : {
            type : String,
            minlength : [6,"Password must be at least 6 characters"],
            required : [true,"Password is required"],
        },
        cartItems : [
            {   
                quantity : {
                    type : Number,
                    default : 1,
                },
                product : {
                    type : Schema.Types.ObjectId,
                    ref : "Product",
                    required : true,
                }
            }
        ],
        role : {
            type : String,
            enum : ["customer","admin"],
            default : "customer",
        }
    }, 
    {
        timestamps : true,
    }
)

//encrypting the password using bcrypt
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return next()
    }
    else{
        try{
            this.password = await bcrypt.hash(this.password,10)
            next()
        }
        catch(err){
            next(err)
        }
    }
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            id : this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRES_IN
        }
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    )
}

export const User = mongoose.model("User",userSchema)