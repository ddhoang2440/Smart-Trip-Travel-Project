import Booking from "../model/booking.js";
import BookingSlot from "../model/bookingSlot.js";

export const createBookingSlot = async (req, res) => {
  try {
    const createData = {
      ...req.body,
    };
    await BookingSlot.create(createData);
    res.json({
      success: true,
      message: "create booking slot successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "fail to create booking slot",
    });
  }
};
export const getBookingSlot = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    console.log("Backend nhận restaurantId:", restaurantId);
    if (!restaurantId) {
      return res.json({
        success: false,
        message: "restaurantId is required",
      });
    }
    const bookingslots = await BookingSlot.find({
      restaurant_id: restaurantId,
    });
    res.json({
      success: true,
      message: "get booking slot successfully",
      bookingslots: bookingslots,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "fail to get booking slot",
    });
  }
};
export const getBookingSlotById = async (req, res) => {
  try {
    const bookingslot = await BookingSlot.find({});
    res.json({
      success: true,
      message: "get booking slot successfully",
      bookingslot: bookingslot,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "fail to get booking slot",
    });
  }
};
export const updateBookingSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await BookingSlot.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      message: "update booking slot successfully",
      bookingslot: updated,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "fail to update booking slot",
    });
  }
};
export const deleteBookingSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await BookingSlot.findByIdAndDelete(id);
    if (!deleted) {
      return res.json({
        success: false,
        message: "Booking slot not found",
      });
    }
    res.json({
      success: true,
      message: "update booking slot successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "fail to update booking slot",
    });
  }
};
export const getTablesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date, timeSlot } = req.query;

    const tables = await BookingSlot.find({
      restaurant_id: restaurantId,
    });

    const bookings = await Booking.find({
      restaurant_id: restaurantId,
      booking_date: date,
      slot_id: timeSlot,
      status: { $in: ["Confirmed", "seated"] },
      table_id: { $exists: true, $ne: null },
    });

    res.status(200).json({
      success: true,
      message: "get table by res successfully",
      tables: tables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
