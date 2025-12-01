# from fastapi import APIRouter, Request
# from .intentService import extract_user_intent, process_ai_response
# from ai.entities import MessageRequest

# router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

# @router.post("/analyze")
# async def analyze_message(request: Request):
#     data = await request.json()
#     message = data.get("message")
#     user_id = data.get("user_id")
#     timestamp = data.get("timestamp")

#     if not all([message, user_id, timestamp]):
#         return {"success": False, "message": "Missing input data (message, user_id, timestamp)"}

#     msg_request = MessageRequest(user_id=user_id, message=message, timestamp=timestamp)
#     intents = await extract_user_intent(msg_request)
#     if intents is None:
#         return {"success": False, "message": "Failed to extract intents"}
#     res = await process_ai_response(intents)
#     return {"success": True, "  ": res}
from asyncio.log import logger
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from .intentService import extract_user_intent, process_ai_response
from ai.entities import MessageRequest
from entities.user_entity import UserEntity
from routes.user_route import get_current_user 
    
router = APIRouter(prefix="/chatbot", tags=["Chatbot"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# @router.post("/analyze")
# async def analyze_message(
#     request_data: dict,
#     current_user: UserEntity = Depends(get_current_user)
# ):
#     """
#     Xử lý tin nhắn từ người dùng với authentication
#     Sử dụng current_user từ dependency injection thay vì user_id từ request
#     """
#     try:
#         message = request_data.get("message")
#         timestamp = request_data.get("timestamp")  # Optional: để tracking hoặc logging
        
#         if not message:
#             raise HTTPException(status_code=400, detail="Message is required")
        
#         # Tạo MessageRequest với current_user
#         msg_request = MessageRequest(
#             user_id=str(current_user.id),  # Lấy từ current_user
#             user_email=current_user.email,
#             user_name=current_user.username,
#             message=message,
#             timestamp=timestamp or datetime.utcnow().isoformat()
#         )
        
#         # Extract intent từ message
#         intents = await extract_user_intent(msg_request)
#         if not intents:
#             return {
#                 "success": False,
#                 "message": "Không thể xác định ý định từ tin nhắn"
#             }
        
#         # Xử lý response với thông tin user
#         result = await process_ai_response(intents, current_user)
        
#         # Format response
#         if isinstance(result, dict) and "restaurants" in result:
#             return {
#                 "success": True,
#                 "type": "restaurant-list",
#                 "restaurants": result["restaurants"],
#                 "message": result.get("message", f"Tìm thấy {len(result['restaurants'])} nhà hàng"),
#                 "user_context": {
#                     "name": current_user.username,
#                     # "preferences": current_user.preferences or {}
#                 }
#             }
        
#         # Response thông thường
#         return {
#             "success": True,
#             "type": "text",
#             "reply": str(result) if not isinstance(result, dict) else result.get("message", "Đã xử lý"),
#             "user_context": {
#                 "name": current_user.username
#             }
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Chatbot error: {str(e)}", exc_info=True)
#         raise HTTPException(status_code=500, detail="Internal server error")
@router.post("/analyze")
async def analyze_message(
    request_data: dict,
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Xử lý tin nhắn từ người dùng với authentication
    """
    try:
        message = request_data.get("message")
        timestamp = request_data.get("timestamp")
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Tạo MessageRequest
        msg_request = MessageRequest(
            user_id=str(current_user.id),
            user_email=current_user.email,
            user_name=current_user.username,
            message=message,
            timestamp=timestamp or datetime.utcnow().isoformat()
        )
        
        # Extract intent
        intents = await extract_user_intent(msg_request)
        if not intents:
            return {
                "success": False,
                "message": "Không thể xác định ý định từ tin nhắn",
                "type": "error"
            }
        
        # Process với current_user
        result = await process_ai_response(intents, current_user)
        
        # Kiểm tra nếu result là dict và có type
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