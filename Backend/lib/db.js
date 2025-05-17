import mongoose from "mongoose"

export const connectDB = async() => {
    try{
        const res = await mongoose.connect(process.env.MONGO_URI)
    }
    catch(err){
        console.log("Error connecting with the MongoDB Server")
        process.exit(1)
    }
}