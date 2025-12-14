import mongoose from "mongoose";

// connect to mongodb
export const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Connect to mongoDb succesfully!")
    } catch (error) {
        console.log("Connect to mongoDb failed!" ,error.message)
    }
}
