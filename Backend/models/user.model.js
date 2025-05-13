import mongoose,{Schema} from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        username : {
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
    if(!this.isModified(this.password)){
        next()
    }
    else{
        try{
            const salt = bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password,salt)
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

export const User = mongoose.model("User",userSchema)