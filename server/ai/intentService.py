import json
import re

from .client import call_gemini
from .entities import MessageRequest
from .prompts.newIntent import intent
from .prompts.session import session_prompt
from .sessionManager import SessionManager

from .handlers.suggestHandler import SuggestHandler
from .handlers.searchHandler import SearchHandler
from .handlers.compareHandler import CompareHandler
from .handlers.bookingHandler import BookingHandler
from .handlers.payHandler import PayHandler
from .handlers.scheduleHandler import ScheduleHandler
from .handlers.historyHandler import HistoryHandler
from .handlers.cancelHander import CancelHandler
from .handlers.modifyHandler import ModifyHandler

INTENT_HANDLERS = {
    "suggest": SuggestHandler(),
    "search": SearchHandler(),
    "compare": CompareHandler(),
    "booking": BookingHandler(),
    "pay": PayHandler(),
    "schedule": ScheduleHandler(),
    "history": HistoryHandler(),
    "cancel": CancelHandler(),
    "modify": ModifyHandler()
}

async def extract_user_intent(request: MessageRequest):
    prompt = intent(request.message)
    raw_output = call_gemini(prompt)
    if raw_output is None:
        return []
    print (raw_output)
    cleaned = re.search(r'\[.*\]', raw_output, re.DOTALL)
    if cleaned:
        raw_output = cleaned.group(0)
    try:
        result = json.loads(raw_output)
        if isinstance(result, dict):
            result = [result]
        elif not isinstance(result, list):
            result = []
        return result
    except Exception as e:
        print("JSON parse error:", e)
        return None
    
async def build_user_session(message: str, session: dict):
    prompt = session_prompt(message, session)
    output = call_gemini(prompt)
    try:
        result = json.loads(output)
        return {
            "action": result.get("action"),
            "updated_session": result.get("updated_session"),
            "reply": result.get("reply")
        }
    except:
        return {
            "action": "no_action",
            "session": output,
            "reply": "Xin lỗi, tôi không hiểu yêu cầu của bạn."
        }

def get_slot_value(fields: dict, slot_name: str, default=None):
    slot = fields.get(slot_name)
    if isinstance(slot, dict):
        return slot.get("value", default)
    return default

async def handle_intents(json_list: dict, current_user=None):
    results = []

    for payload in json_list:
        intent_name = payload.get("intent")

        params = payload.get("fields", {}) or {}

        # Thêm thông tin user vào params nếu có
        if current_user:
            params["user_id"] = current_user.id
            params["user_email"] = current_user.email

        handler = INTENT_HANDLERS.get(intent_name)
        if handler is None:
            results.append({
                "type": "error",
                "message": f"Không hỗ trợ intent: {intent_name}",
                "error": f"Unknown intent: {intent_name}"
            })
            continue

        try:
            result = await handler.run(payload)
            results.append(result)
        except Exception as e:
            print(f"Handler error for intent {intent_name}: {str(e)}")
            results.append({
                "type": "error",
                "message": "Đã có lỗi xảy ra khi xử lý yêu cầu",
                "error": str(e)
            })
    return results[0] if len(results) == 1 else results
    
async def handle_session_message(request: MessageRequest, current_user=None):
    user_id = str(current_user.id)
    message = request.message

    # 1️⃣ Kiểm tra session Redis
    session = await SessionManager.get(user_id)

    if session:
        log = await SessionManager.show_all()
        print("Log:",log)
        session = await build_user_session(message, session) # Cập nhật session dựa trên message mới

        action = session["action"]
        updated = session["updated_session"]
        reply = session["reply"]
        print("Session:", session)

        if action == "update_booking":
            await SessionManager.set(user_id, updated)
            return {
                "type": "booking-preview",  # Hiển thị thông tin hiện tại cho người dùng
                "message": reply,
                "booking_info": updated  # Trả về thông tin booking đã cập nhật
            }

        if action == "confirm_booking":
            handler = INTENT_HANDLERS.get("booking")
            result = await handler.handle("confirm", None, updated)
            print(result)
            await SessionManager.delete(user_id)
            return {
                "type": "booking-confirmed",
                "message": "Đặt bàn thành công!",
                "booking_info": result
            }

        if action == "cancel_booking":
            await SessionManager.delete(user_id)
            return {
                "type": "booking-canceled",
                "message": "Đã hủy đặt bàn."
            }

        if action == "no_action":
            return {
                "type": "booking-form",
                "message": "Mình không lấy được thông tin của bạn, vui lòng điền form"
            }

        return {"message": reply}

    # 2️⃣ Nếu không có session → xử lý intent bình thường
    intents = await extract_user_intent(request)
    response = await handle_intents(intents, current_user)

    # 3️⃣ Nếu intent là booking → tạo session trong Redis
    if response.get("action") == "create_booking":
        session_obj = response.get("updated_session")
        await SessionManager.set(user_id, session_obj)

    return response