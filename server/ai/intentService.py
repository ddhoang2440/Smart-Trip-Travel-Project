import json
import re

from .client import call_gemini
from .entities import MessageRequest
from .prompts.newIntent import intent

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

def get_slot_value(fields: dict, slot_name: str, default=None):
    slot = fields.get(slot_name)
    if isinstance(slot, dict):
        return slot.get("value", default)
    return default

# async def process_ai_response(json_list):
#     results = []

#     for obj in json_list:
#         intent_name = obj.get("intent")
#         type_ = obj.get("type")
#         entities = obj.get("entities")
#         params = obj.get("fields", {}) or {}

#         handler = INTENT_HANDLERS.get(intent_name)
#         if handler is None:
#             results.append({"error": f"Unknown intent: {intent_name}"})
#             continue

#         result = await handler.handle(type_, entities, params)
#         results.append(result)

#     return results
async def process_ai_response(json_list, current_user=None):
    results = []
    
    for obj in json_list:
        intent_name = obj.get("intent")
        type_ = obj.get("type")
        entities = obj.get("entities")
        params = obj.get("fields", {}) or {}
        
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
            result = await handler.handle(type_, entities, params)
            results.append(result)
        except Exception as e:
            print(f"Handler error for intent {intent_name}: {str(e)}")
            results.append({
                "type": "error",
                "message": "Đã có lỗi xảy ra khi xử lý yêu cầu",
                "error": str(e)
            })
    
    # Return single result if only one, otherwise return all
    return results[0] if len(results) == 1 else results