import Booking from "../model/booking.js";
import BookingSlot from "../model/bookingSlot.js";

const log = console.log;

export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { booking_date, quantity, table, slot_id, restaurant_id } = req.body;
    if (!booking_date || !quantity || !table || !slot_id || !restaurant_id) {
      return res
        .status(400)
        .json({ success: false, message: "All value must valid !" });
    }
    const currentslot = await BookingSlot.findById(slot_id);
    if (!currentslot) {
      return res
        .status(400)
        .json({ success: false, message: "Slot not found !" });
    }
    let max_table = 0;

    switch (Number(table)) {
      case 2:
        max_table = currentslot.max_slot_2;
        break;
      case 4:
        max_table = currentslot.max_slot_4;
        break;
      case 8:
        max_table = currentslot.max_slot_8;
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid Table Type !" });
    }
    const existBooking = Booking.find({
      restaurant_id,
      slot_id,
      booking_date,
      table: Number(table),
    });
    const totalBooked = (await existBooking).reduce(
      (sum, item) => item.quantity + sum,
      0
    );
    if (totalBooked + quantity > max_table) {
      const remain = max_table - totalBooked;
      return res.status(400).json({
        success: false,
        message: `Hết Bạn Loại ${table} người, chỉ còn trống ${remain} bàn`,
      });
    }
    const newBooking = {
      user_id: _id,
      quantity,
      booking_date,
      slot_id,
      restaurant_id,
      table,
    };
    const booking = await Booking.create(newBooking);
    res.status(200).json({
      success: true,
      message: "Create new booking successfully !",
      booking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !" });
    console.log(error.message);
  }
};

export const getBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user_id: _id })
      .sort({ createdAt: -1 })
      .populate("restaurant_id", "name address images type owner")
      .populate("slot_id");
    if (!bookings) {
      return res
        .status(400)
        .json({ success: false, message: "Failed To Get User Booking !" });
    }
    res.status(200).json({
      success: true,
      message: "Get user booking successfully !",
      bookings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !" });
    console.log(error.message);
  }
};
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ restaurant_id: id })
      .sort({ createdAt: -1 })
      .populate("user_id")
      .populate("slot_id");
    if (!bookings) {
      return res
        .status(400)
        .json({ success: false, message: "Failed To Get User Booking !" });
    }
    res.status(200).json({
      success: true,
      message: "Get user booking by id successfully !",
      bookingById: bookings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "fail to get booking by id" });
    console.log(error.message);
  }
};
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn đặt bàn",
      });
    }
    booking.status = status;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đặt bàn thành công",
      booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật booking",
    });
  }
};
export const assignTableToBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { tableId } = req.body;

    // Kiểm tra booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Kiểm tra bàn
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Kiểm tra bàn có đủ chỗ không
    if (table.capacity < booking.quantity) {
      return res.status(400).json({
        success: false,
        message: `Bàn chỉ có ${table.capacity} chỗ, không đủ cho ${booking.quantity} khách`,
      });
    }

    // Kiểm tra bàn có trống trong khung giờ đó không
    const existingBooking = await Booking.findOne({
      restaurant_id: booking.restaurant_id,
      booking_date: booking.booking_date,
      slot_id: booking.slot_id,
      table_id: tableId,
      status: { $in: ["confirmed", "seated"] },
    });

    if (existingBooking && existingBooking._id.toString() !== bookingId) {
      return res.status(400).json({
        success: false,
        message: "Bàn đã được đặt trong khung giờ này",
      });
    }

    // Cập nhật booking với bàn được gán
    booking.table_id = tableId;
    booking.status = "seated"; // Cập nhật trạng thái
    booking.table_assigned_at = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Sắp bàn thành công",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
