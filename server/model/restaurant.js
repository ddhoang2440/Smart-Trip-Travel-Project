import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: {type:String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    rating: {type: Number, default: 0},
    review: {type: Number, default: 0},
    open: {type: Boolean , default: true},
    address: {type: String, required: true},
    from: {type: String , required: true},
    to: {type: String, required: true},
    type: {type: String},
    images: {type: [String], default: []},
    images_id: {type: [String], default: []},
    medium_price : {type: Number},
    bookingAvailable: {type:Boolean, default: false},
    description: { type: String },
    lat: { type: Number },
    lon: { type: Number },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' } // Quan trọng: index 2dsphere
    },
    normal_close: [{ type: Number }],
    special_close: [{ type: Date }]
},{timestamps: true});

const Restaurant = mongoose.model("restaurant", restaurantSchema);
Restaurant.createIndexes({ location: "2dsphere" });

export default Restaurant;