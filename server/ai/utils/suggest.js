import { FilterSpec, GeoFilterSpec, buildFilter } from "./filter.js";

import Booking from "../../model/booking.js";
import BookingSlot from "../../model/bookingSlot.js";

export const suggestRestaurant = async (
  center = null,
  maxDistance = 2000,
  limit = 10
) => {
  const filters = [];
  filters.push(new FilterSpec("open_now", "=", true));
  let geoFilter = null;
  if (center) {
    geoFilter = new GeoFilterSpec(center, maxDistance);
  }

  const pipeline = buildFilter(filters, geoFilter, "AND");
  pipeline.push({ $limit: limit });
  return pipeline;
};

export const suggestBookingSlots = async ({
  restaurantId,
  bookingDate = new Date(),
  table = 4,
}) => {
  if (!restaurantId || !bookingDate || !table) return [];

  const startOfDay = new Date(bookingDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(bookingDate);
  endOfDay.setHours(23, 59, 59, 999);

  const now = new Date();
  const isToday = bookingDate.toDateString() === now.toDateString();
  const currentTime = now.toTimeString().slice(0, 5);

  const slots = await BookingSlot.find({ restaurant_id: restaurantId }).lean();

  const suggestions = [];

  for (const slot of slots) {
    if (isToday && slot.time <= currentTime) {
      continue;
    }
    const bookings = await Booking.find({
      restaurant_id: restaurantId,
      slot_id: slot._id,
      booking_date: { $gte: startOfDay, $lte: endOfDay },
      table: Number(table),
      status: "Confirmed",
    }).lean();

    const totalBooked = bookings.reduce((sum, b) => sum + b.quantity, 0);

    let maxTables = 0;
    switch (Number(table)) {
      case 2:
        maxTables = slot.max_slot_2;
        break;
      case 4:
        maxTables = slot.max_slot_4;
        break;
      case 8:
        maxTables = slot.max_slot_8;
        break;
      default:
        maxTables = 0;
    }

    const remaining = maxTables - totalBooked;

    if (remaining > 0) {
      suggestions.push({
        slot_id: slot._id,
        time: slot.time,
        remaining,
      });
    }
  }
  suggestions.sort((a, b) => a.time.localeCompare(b.time));

  return suggestions;
};
