import { callGemini } from "./client.js";
import { intentPrompt } from "./prompts/intent.js";
import { sessionPrompt } from "./prompts/session.js";
import SessionManager from "./sessionManager.js";
import SearchHandler from "./handlers/searchHandler.js";
import BookingHandler from "./handlers/bookingHandler.js";

// =================== HANDLER MAP ===================
export const INTENT_HANDLERS = {
  search: new SearchHandler(),
  booking: new BookingHandler(),
};

// =====================================================
//     EXTRACT USER INTENT
// =====================================================
export const extractUserIntent = async (request) => {
  const prompt = intentPrompt(request.message);
  //const raw = await callGemini(prompt);
  const raw = fake[4];

  if (!raw) return [];

  console.log("AI Output:", raw);

  // Lọc JSON trong []
  // const match = raw.match(/\[.*\]/s);
  // const cleaned = match ? match[0] : raw;
  return raw;
  // try {
  //   let result = JSON.parse(cleaned);

  //   if (Array.isArray(result)) return result;
  //   if (typeof result === "object") return [result];

  //   return [];
  // } catch (err) {
  //   console.log("JSON parse error:", err);
  //   return null;
  // }
};

// =====================================================
//     BUILD USER SESSION
// =====================================================
export const buildUserSession = async (message, session) => {
  const prompt = sessionPrompt(message, session);
  const output = await callGemini(prompt);

  try {
    const result = JSON.parse(output);
    return {
      action: result.action,
      updated_session: result.updated_session,
      reply: result.reply,
    };
  } catch {
    return {
      action: "no_action",
      session: output,
      reply: "Xin lỗi, tôi không hiểu yêu cầu của bạn.",
    };
  }
};

// =====================================================
//     HANDLE INTENTS
// =====================================================
export const handleIntents = async (jsonList, currentUser = null, lat, lng) => {
  const results = [];

  for (const payload of jsonList) {
    const intentName = payload.intent;
    let params = payload.fields || {};

    if (currentUser) {
      params.user_id = currentUser.id;
      params.user_email = currentUser.email;
    }

    const handler = INTENT_HANDLERS[intentName];
    if (!handler) {
      results.push({
        type: "error",
        message: `Không hỗ trợ intent: ${intentName}`,
        error: `Unknown intent: ${intentName}`,
      });
      continue;
    }

    try {
      const result = await handler.run(payload, lat, lng);
      results.push(result);
    } catch (err) {
      console.log(`Handler error for intent ${intentName}:`, err);
      results.push({
        type: "error",
        message: "Đã có lỗi xảy ra khi xử lý yêu cầu",
        error: String(err),
      });
    }
  }

  return results.length === 1 ? results[0] : results;
};

// =====================================================
//     HANDLE SESSION MESSAGE
// =====================================================
export const handleSessionMessage = async (request, currentUser, lat, lng) => {
  const userId = String(currentUser._id);
  const message = request.message;

  if (request.suggestion) {
    const handler = INTENT_HANDLERS["booking"];
    return await handler.handle("confirm", null, {
      ...request.suggestion,
      userId,
    });
  }

  // 1️⃣ Check Redis session
  let session = await SessionManager.get(userId);
  //let session = false;

  if (session) {
    //const updated = await buildUserSession(message, session);
    const updated = fakeSession[2];

    const action = updated.action;
    const newSession = updated.updated_session;
    const reply = updated.reply;

    console.log("Session:", updated);

    if (action === "update_booking") {
      await SessionManager.set(userId, newSession);
      return {
        type: "booking-preview",
        message: reply,
        booking: newSession,
      };
    }

    if (action === "confirm_booking") {
      const handler = INTENT_HANDLERS["booking"];
      const params = {
        ...newSession,
        userId,
      };
      const result = await handler.handle("confirm", null, params);

      await SessionManager.delete(userId);

      return {
        type: "booking-confirmed",
        message: "Đặt bàn thành công!",
        booking: result,
      };
    }

    if (action === "cancel_booking") {
      await SessionManager.delete(userId);
      return {
        type: "booking-canceled",
        message: "Đã hủy đặt bàn.",
      };
    }
    if (result?.action === "booking_failed") {
      return {
        type: "booking-failed",
        message: result.message,
      };
    }
    if (action === "no_action") {
      return {
        type: "booking-form",
        message: "Mình không lấy được thông tin của bạn, vui lòng điền form",
      };
    }

    return { message: reply };
  }

  // 2️⃣ If no session = normal intent handling
  const intents = await extractUserIntent(request);
  const response = await handleIntents(intents, currentUser, lat, lng);
  console.log("Handle intents response:", response);

  // 3️⃣ If booking → create new Redis session
  if (response?.action === "create_booking") {
    await SessionManager.set(userId, response.updated_session);
    return {
      type: "booking-preview",
      booking: response.updated_session,
      message: response.message,
    };
  }
  if (response?.action === "suggest_booking") {
    return {
      type: "suggest-booking",
      bookings: response.suggestions,
      message: response.message,
    };
  }
  return response;
};

const fake = [
  //Gợi ý nhà hàng
  [
    {
      intent: "search",
      type: "reply",
      entity: "restaurant",
      fields: {
        food_name: { value: null, canonical: null, operator: null },
        res_name: { value: null, canonical: null, operator: null },
        distance_m: { value: null, canonical: null, operator: null },
        address: { value: null, canonical: null, operator: null },
        res_price: null,
        food_price: null,
        open_now: { value: null, canonical: null, operator: null },
        time_range: null,
        is_suggestion: true,
        location: { value: null, type: "place", operator: null },
      },
    },
  ],
  //Tìm nhà hàng quận 3
  [
    {
      intent: "search",
      type: "reply",
      entity: "restaurant",
      fields: {
        food_name: { value: null, canonical: null, operator: null },
        res_name: { value: null, canonical: null, operator: null },
        distance_m: { value: null, canonical: null, operator: null },
        address: { value: "quận 3", canonical: null, operator: null },
        res_price: null,
        food_price: null,
        open_now: { value: null, canonical: null, operator: null },
        time_range: null,
        is_suggestion: false,
        location: { value: null, type: "place", operator: null },
      },
    },
  ],
  //Tìm quán quanh quận 3
  [
    {
      intent: "search",
      type: "reply",
      entity: "restaurant",
      fields: {
        food_name: { value: null, canonical: null, operator: null },
        res_name: { value: null, canonical: null, operator: null },
        distance_m: { value: null, canonical: null, operator: null },
        address: { value: null, canonical: null, operator: null },
        res_price: null,
        food_price: null,
        open_now: { value: null, canonical: null, operator: null },
        time_range: null,
        is_suggestion: true,
        location: { value: "quận 3", type: "place", operator: null },
      },
    },
  ],
  // Gợi ý đặt bàn
  [
    {
      intent: "booking",
      type: "reply",
      entity: "restaurant",
      fields: {
        restaurant: null,
        booking_time: { from: null, to: null },
        booking_date: null,
        quantity: null,
        table: null,
        is_suggestion: true,
        location: null,
      },
    },
  ],
  //Đặt bàn tại The Log Restaurant
  [
    {
      intent: "booking",
      type: "reply",
      entity: "restaurant",
      fields: {
        restaurant: "The Log Restaurant",
        time: { from: null, to: null },
        booking_date: null,
        quantity: null,
        table: null,
        is_suggestion: false,
        location: null,
      },
    },
  ],
];
const fakeFirstSession = [
  {
    flow: "booking.create",
    quantity: null,
    booking_time: {
      from: "08:00",
      to: null,
    },
    booking_date: "2025-12-19",
    restaurant: null,
    table: null,
    is_suggestion: true,
  },
];
const fakeSession = [
  // Lúc 8 giờ ngày mai
  {
    action: "update_booking",
    updated_session: {
      flow: "booking.update",
      quantity: null,
      booking_time: { from: "08:00", to: null },
      booking_date: "2025-12-19T00:00:00.000Z",
      restaurant: "The Log Restaurant",
      table: null,
      is_suggestion: false,
      location: { value: null, type: "place", operator: null },
    },
    reply:
      "Dạ, em đã cập nhật nhà hàng The Log Restaurant cho lịch hẹn lúc 08:00 ngày 19/12. Anh/Chị dự định đi bao nhiêu người và muốn đặt bàn loại mấy người (loại 2, 4 hay 8 chỗ) để em hoàn tất thông tin ạ?",
  },
  // 4 người và bàn loại 4
  {
    action: "update_booking",
    updated_session: {
      flow: "booking.update",
      quantity: 4,
      booking_time: { from: "08:00", to: null },
      booking_date: "2025-12-19T00:00:00.000Z",
      restaurant: "The Log Restaurant",
      table: 4,
      is_suggestion: false,
      location: { value: null, type: "place", operator: null },
    },
    reply:
      "Dạ, em đã cập nhật đầy đủ thông tin: Anh/Chị đặt bàn cho 4 người (loại bàn 4 chỗ) tại nhà hàng The Log Restaurant vào lúc 08:00 ngày 19/12/2025. Anh/Chị xác nhận thông tin này để em hoàn tất đặt chỗ nhé!",
  },
  // Ok hãy đặt bàn đó cho mình
  {
    action: "confirm_booking",
    updated_session: {
      flow: "booking.confirm",
      quantity: 4,
      booking_time: { from: "08:00", to: "09:00" },
      booking_date: "2025-12-19T00:00:00.000Z",
      restaurant: "The Elite Dining - Ẩm Thực Tinh Hoa",
      table: 4,
      is_suggestion: false,
      location: { value: null, type: "place", operator: null },
    },
    reply:
      "Dạ vâng, em đã xác nhận đặt bàn thành công cho Anh/Chị tại nhà hàng The Log Restaurant vào lúc 08:00 ngày 19/12/2025 cho 4 người (bàn 4 chỗ). Hẹn gặp lại Anh/Chị tại nhà hàng ạ!",
  },
];
