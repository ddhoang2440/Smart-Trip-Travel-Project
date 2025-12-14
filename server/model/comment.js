import mongoose, { Types } from "mongoose";


const commentSchema = new mongoose.Schema({
    restaurant_id : {type: mongoose.Schema.Types.ObjectId , ref: "restaurant", required:true},
    user_id : {type: mongoose.Schema.Types.ObjectId , ref: "user", required:true},
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    images: { type: [String], default: []}
}, {timestamps: true})


const Comment = mongoose.model("comment", commentSchema);

export default Comment;