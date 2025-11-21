import mongoose from "mongoose";

const foodSchema  = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    igredient: {type: [String]},
    type: {type: String},
    isVegetarian: {type: Boolean, default: false},
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" , required: true},
    image: {type:String},
    image_id: {type: String},
    description: {type: String},
},{timestamps: true});


const Menu = mongoose.model("menu", foodSchema);

export default Menu;