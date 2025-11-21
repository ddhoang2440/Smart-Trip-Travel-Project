import mongoose from "mongoose";



const UserSchema = new mongoose.Schema({
    username: {type:String , required: true },
    email: {type:String , required: true , unique: true},
    password: {type:String , required:true},
    contact: {type: String},
    allergy: {type: [String]},
    image: {type: String},
    image_url: {type: String},
},{timestamps: true});


const user = mongoose.model("user", UserSchema);

export default user;