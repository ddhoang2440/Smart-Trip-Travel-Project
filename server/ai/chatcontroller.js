import { callGemini } from "./client.js";
import { intentPrompt } from "./prompts/intent.js";
import { sessionPrompt } from "./prompts/session.js";
import SessionManager from "./sessionManager.js";
import SearchHandler from "./handlers/searchHandler.js";

// =================== HANDLER MAP ===================
export const INTENT_HANDLERS = {
  search: new SearchHandler(),
};

// =====================================================
//     EXTRACT USER INTENT
// =====================================================
export const extractUserIntent = async (request) => {
  const prompt = intentPrompt(request.message);
  const raw = await callGemini(prompt);

  if (!raw) return [];

  console.log("AI Output:", raw);

  // Lọc JSON trong []
  const match = raw.match(/\[.*\]/s);
  const cleaned = match ? match[0] : raw;

  try {
    let result = JSON.parse(cleaned);

    if (Array.isArray(result)) return result;
    if (typeof result === "object") return [result];

    return [];
  } catch (err) {
    console.log("JSON parse error:", err);
    return null;
  }
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
export const handleIntents = async (jsonList, currentUser = null) => {
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
      const result = await handler.run(payload);
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
export const handleSessionMessage = async (request, currentUser) => {
  const userId = String(currentUser.sub);
  const message = request.message;

  // 1️⃣ Check Redis session
  let session = await SessionManager.get(userId);

  if (session) {
    const updated = await buildUserSession(message, session);

    const action = updated.action;
    const newSession = updated.updated_session;
    const reply = updated.reply;

    console.log("Session:", updated);

    if (action === "update_booking") {
      await SessionManager.set(userId, newSession);
      return {
        type: "booking-preview",
        message: reply,
        booking_info: newSession,
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
        booking_info: result,
      };
    }

    if (action === "cancel_booking") {
      await SessionManager.delete(userId);
      return {
        type: "booking-canceled",
        message: "Đã hủy đặt bàn.",
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
  const response = await handleIntents(intents, currentUser);

  // 3️⃣ If booking → create new Redis session
  if (response?.action === "create_booking") {
    await SessionManager.set(userId, response.updated_session);
  }

  return response;
};
