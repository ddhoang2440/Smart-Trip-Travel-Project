import mongoose, { Types } from "mongoose";



const bookingSlotSchema = new mongoose.Schema({
  restaurant_id: { type: Types.ObjectId, ref: "restaurant", required: true },
  time: { type: String, required: true },
  max_slot_2: { type: Number },
  max_slot_4: { type: Number },
  max_slot_8: { type: Number },
}, { timestamps: true });

const BookingSlot = mongoose.model("BookingSlot", bookingSlotSchema);


export default BookingSlot  