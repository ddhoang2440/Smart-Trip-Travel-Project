import IntentHandler from "./base.js";
import Restaurant from "../../model/restaurant.js";
import Booking from "../../model/booking.js";
import BookingSlot from "../../model/bookingSlot.js";
import { suggestRestaurant, suggestBookingSlots } from "../utils/suggest.js";

export default class BookingHandler extends IntentHandler {
  async handle(type, entity, params, center) {
    if (type === "reply") {
      return await this.bookingText(params);
    } else if (type === "confirm") {
      return await this.bookingConfirm(params);
    }
    return null;
  }

  async bookingText(params) {
    // --- Lấy dữ liệu từ params ---
    const quantity = params?.quantity || null;
    const booking_time = params?.booking_time || null; // { from, to }
    const booking_date = params?.booking_date || null; // ISO date string
    const restaurant = params?.restaurant || null;
    const table = params?.table || null;
    const is_suggestion = params?.is_suggestion || false;

    if (is_suggestion && (!restaurant || !table || !quantity)) {
      const suggestions = await generateBookingSuggestions(
        {
          restaurant,
          booking_date,
          booking_time,
          table,
          quantity,
        },
        params.location,
        4
      );

      return {
        action: "suggest_booking",
        suggestions: suggestions.map((s, index) => ({
          id: `SUGG_${index + 1}`,
          ...s,
        })),
        message:
          "Mình gợi ý một số lựa chọn phù hợp, bạn chọn 1 giúp mình nhé (ví dụ: chọn gợi ý 1)",
      };
    }

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
        is_suggestion,
      },
      message:
        "Đây là thông tin đặt bàn của bạn. Hãy cung cấp đủ thông tin để mình có thể đặt bàn",
    };

    console.log("Formatted booking data:", formatted_data);
    return formatted_data;
  }
  // async bookingConfirm(params) {
  //   try {
  //     const {
  //       restaurant,
  //       booking_date, // ISO string
  //       booking_time, // { from, to }
  //       table,
  //       quantity,
  //       userId,
  //     } = params;

  //     if (
  //       !restaurant ||
  //       !booking_date ||
  //       !booking_time ||
  //       !table ||
  //       !quantity
  //     ) {
  //       return {
  //         success: false,
  //         message: "Thiếu thông tin booking. Vui lòng điền đầy đủ.",
  //       };
  //     }

  //     const res = await findRestaurantByName(restaurant);
  //     if (!res) {
  //       return { success: false, message: "Không tìm thấy nhà hàng." };
  //     }

  //     const slot = await findSlotByTime(
  //       res._id,
  //       booking_time.from,
  //       booking_time.to
  //     );
  //     if (!slot) {
  //       return { success: false, message: "Không tìm thấy slot phù hợp." };
  //     }

  //     let max_table = 0;
  //     switch (Number(table)) {
  //       case 2:
  //         max_table = slot.max_slot_2;
  //         break;
  //       case 4:
  //         max_table = slot.max_slot_4;
  //         break;
  //       case 8:
  //         max_table = slot.max_slot_8;
  //         break;
  //       default:
  //         return { success: false, message: "Loại bàn không hợp lệ." };
  //     }

  //     const existBooking = await Booking.find({
  //       restaurant_id: res._id,
  //       slot_id: slot._id,
  //       booking_date,
  //       table: Number(table),
  //     });
  //     const totalBooked = existBooking.reduce((sum, b) => sum + b.quantity, 0);
  //     if (totalBooked + quantity > max_table) {
  //       const remain = max_table - totalBooked;
  //       return {
  //         success: false,
  //         message: `Chỉ còn ${remain} bàn loại ${table}.`,
  //       };
  //     }
  //     const newBooking = {
  //       user_id: userId,
  //       restaurant_id: res._id,
  //       slot_id: slot._id,
  //       booking_date,
  //       table,
  //       quantity,
  //     };
  //     const booking = await Booking.create(newBooking);

  //     return {
  //       success: true,
  //       message: "Đặt bàn thành công!",
  //       booking,
  //     };
  //   } catch (err) {
  //     console.log(err);
  //     return { success: false, message: "Lỗi khi tạo booking." };
  //   }
  // }
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
          action: "booking_failed",
          reason: "out_of_slot",
          message:
            remain > 0
              ? `Chỉ còn ${remain} bàn loại ${table}, không đủ cho yêu cầu của bạn.`
              : `Slot này đã hết bàn loại ${table}., `,
        };
      }
      const newBooking = {
        user_id: userId,
        restaurant_id: res._id,
        slot_id: slot._id,
        booking_date,
        table,
        quantity,
      };
      const booking = await Booking.create(newBooking);
      return booking;
    } catch (err) {
      console.log(err);
      return { success: false, message: "Lỗi khi tạo booking." };
    }
  }
}

export const findRestaurantByName = async (name) => {
  if (!name) return null;
  console.log(name);
  const restaurant = await Restaurant.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  }).lean();
  console.log(restaurant);

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

export const generateBookingSuggestions = async (
  session = {},
  userLocation = null,
  maxSuggestions = 8
) => {
  const suggestions = [];
  let restaurantDocs = [];

  // --- Bước 1: Gợi ý nhà hàng ---
  if (session.restaurant) {
    const res = await findRestaurantByName(session.restaurant);
    if (res) restaurantDocs = [res];
  } else {
    const pipeline = await suggestRestaurant(userLocation);
    restaurantDocs = await Restaurant.aggregate(pipeline).limit(maxSuggestions);
  }
  console.log(restaurantDocs);
  // --- Bước 2: Gợi ý slot cho mỗi nhà hàng ---
  for (const res of restaurantDocs) {
    // Nếu session chưa có booking_date → lấy ngày hôm nay
    const bookingDate = session.booking_date
      ? new Date(session.booking_date)
      : new Date();
    const table = session.table || 4; // default 4 người
    const quantity = session.quantity || 1;

    const slots = await suggestBookingSlots({
      restaurantId: res._id,
      bookingDate,
      table,
    });

    console.log(slots);

    for (const slot of slots) {
      suggestions.push({
        restaurant: res.name,
        booking_date: bookingDate.toISOString(),
        booking_time: { from: slot.time, to: slot.time },
        table,
        quantity,
      });

      if (suggestions.length >= maxSuggestions) break;
    }

    if (suggestions.length >= maxSuggestions) break;
  }

  // --- Bước 3: Trả về kết quả ---
  console.log(suggestions);
  return suggestions;
};
