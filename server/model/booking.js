import mongoose, { Types } from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    restaurant_id: { type: Types.ObjectId, ref: "restaurant", required: true },
    user_id: { type: Types.ObjectId, ref: "user", required: true },
    booking_date: { type: Date },
    quantity: { type: Number },
    table: { type: Number, enum: [2, 4, 8] },
    slot_id: { type: Types.ObjectId, ref: "BookingSlot", required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("booking", bookingSchema);

export default Booking;
