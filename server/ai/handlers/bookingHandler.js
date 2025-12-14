import IntentHandler from "./base.js";
import Restaurant from "../../model/restaurant.js";
import Booking from "../../model/booking.js";
import BookingSlot from "../../model/bookingSlot.js";

export default class BookingHandler extends IntentHandler {
  async handle(type, entity, params) {
    if (type === "reply") {
      return await this.bookingText(params);
    } else if (type === "confirm") {
      return await this.bookingConfirm(params);
    }
    return null;
  }

  async bookingText(params) {
    // --- Lấy dữ liệu từ params ---
    const quantity = params?.quantity?.value || null;
    const booking_time = params?.booking_time || null; // { from, to }
    const booking_date = params?.booking_date || null; // ISO date string
    const restaurant = params?.restaurant?.value || null;
    const table = params?.table?.value || null;

    // Nếu thiếu nhiều thông tin thì frontend hiển thị form điền
    const formatted_data = {
      action: "create_booking",
      updated_session: {
        flow: "booking.create",
        quantity,
        booking_time,
        booking_date,
        restaurant,
        table,
      },
      message:
        "Đây là thông tin đặt bàn của bạn. Vui lòng xác nhận để tiếp tục.",
    };

    console.log("Formatted booking data:", formatted_data);
    return formatted_data;
  }
  async bookingConfirm(params) {
    try {
      const {
        restaurant,
        booking_date, // ISO string
        booking_time, // { from, to }
        table,
        quantity,
        userId,
      } = params;

      if (
        !restaurant ||
        !booking_date ||
        !booking_time ||
        !table ||
        !quantity
      ) {
        return {
          success: false,
          message: "Thiếu thông tin booking. Vui lòng điền đầy đủ.",
        };
      }

      const res = await findRestaurantByName(restaurant);
      if (!res) {
        return { success: false, message: "Không tìm thấy nhà hàng." };
      }

      const slot = await findSlotByTime(
        res._id,
        booking_time.from,
        booking_time.to
      );
      if (!slot) {
        return { success: false, message: "Không tìm thấy slot phù hợp." };
      }

      let max_table = 0;
      switch (Number(table)) {
        case 2:
          max_table = slot.max_slot_2;
          break;
        case 4:
          max_table = slot.max_slot_4;
          break;
        case 8:
          max_table = slot.max_slot_8;
          break;
        default:
          return { success: false, message: "Loại bàn không hợp lệ." };
      }

      const existBooking = await Booking.find({
        restaurant_id: res._id,
        slot_id: slot._id,
        booking_date,
        table: Number(table),
      });
      const totalBooked = existBooking.reduce((sum, b) => sum + b.quantity, 0);
      if (totalBooked + quantity > max_table) {
        const remain = max_table - totalBooked;
        return {
          success: false,
          message: `Chỉ còn ${remain} bàn loại ${table}.`,
        };
      }
      const newBooking = {
        userId,
        restaurant_id: res._id,
        slot_id: slot._id,
        booking_date,
        booking_time,
        table,
        quantity,
      };
      const booking = await Booking.create(newBooking);

      return {
        success: true,
        message: "Đặt bàn thành công!",
        booking,
      };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Lỗi khi tạo booking." };
    }
  }
}

export const findRestaurantByName = async (name) => {
  if (!name) return null;

  const restaurant = await Restaurant.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  }).lean();

  return restaurant;
};

export const findSlotByTime = async (restaurant_id, from, to) => {
  if (!restaurant_id || !from || !to) return null;

  const slot = await BookingSlot.findOne({
    restaurant_id,
    time: { $gte: from, $lte: to },
  }).lean();

  return slot;
};
