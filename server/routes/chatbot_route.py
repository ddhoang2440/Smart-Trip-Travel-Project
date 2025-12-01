from fastapi import APIRouter, Request
from services.chatbot_service import ChatService

router = APIRouter(prefix="/chat", tags=["Chat AI"])

@router.post("/ask")
async def ask_ai(request: Request):
    data = await request.json()
    message = data.get("message")
    
    if not message:
        return {"success": False, "message": "Empty message"}
        
    return await ChatService.get_response(message)