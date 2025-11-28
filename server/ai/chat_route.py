from fastapi import APIRouter, Request
from .intentService import extract_user_intent, process_ai_response
from ai.entities import MessageRequest

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

@router.post("/analyze")
async def analyze_message(request: Request):
    data = await request.json()
    message = data.get("message")
    user_id = data.get("user_id")
    timestamp = data.get("timestamp")

    if not all([message, user_id, timestamp]):
        return {"success": False, "message": "Missing input data (message, user_id, timestamp)"}

    msg_request = MessageRequest(user_id=user_id, message=message, timestamp=timestamp)
    intents = await extract_user_intent(msg_request)
    if intents is None:
        return {"success": False, "message": "Failed to extract intents"}
    res = await process_ai_response(intents)
    return {"success": True, "aaa": res}