from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from asyncio.log import logger
from datetime import datetime

from .intentService import extract_user_intent, process_ai_response
from ai.entities import MessageRequest
from entities.user_entity import UserEntity
from routes.user_route import get_current_user

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/analyze")
async def analyze_message(request: dict, current_user: UserEntity = Depends(get_current_user)):
    try:
        message = request.get("message")
        timestamp = request.get("timestamp")

        if not message:
            raise HTTPException(status_code=400, detail="Message is required")

        msg_request = MessageRequest(
            user_id=str(current_user.id),
            user_email=current_user.email,
            user_name=current_user.username,
            message=message,
            timestamp=timestamp or datetime.utcnow().isoformat()
        )

        intents = await extract_user_intent(msg_request)
        if not intents:
            return {
                "success": False,
                "message": "Không thể xác định ý định từ tin nhắn",
                "type": "error"
            }
        
        result = await process_ai_response(intents, current_user)
        if isinstance(result, dict):
            response_type = result.get("type", "reply")
            
            if response_type == "restaurant-list":
                return {
                    "success": True,
                    "type": "restaurant-list",
                    "restaurants": result.get("restaurants", []),
                    "message": result.get("message", f"Tìm thấy {len(result.get('restaurants', []))} nhà hàng"),
                    "metadata": result.get("metadata", {})
                }
            elif response_type == "food-list":
                return {
                    "success": True,
                    "type": "food-list",
                    "food": result.get("food", []),
                    "message": result.get("message", f"Tìm thấy {len(result.get('food', []))} món ăn"),
                    "metadata": result.get("metadata", {})
                }
            elif response_type == "error":
                return {
                    "success": False,
                    "type": "error",
                    "message": result.get("message", "Đã có lỗi xảy ra"),
                    "error": result.get("error")
                }
            else:
                # Reply thông thường
                return {
                    "success": True,
                    "type": "reply",
                    "reply": result.get("message", str(result)),
                    "metadata": result.get("metadata", {})
                }
        
        # Fallback: nếu result không phải dict
        return {
            "success": True,
            "type": "reply", 
            "reply": str(result) if result else "Đã xử lý yêu cầu"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chatbot error: {str(e)}", exc_info=True)
        return {
            "success": False,
            "type": "error",
            "message": "Đã có lỗi xảy ra trong hệ thống",
            "error": str(e)
        }