from fastapi import APIRouter, Depends, Request
from services.comment_service import CommentService
from entities.user_entity import UserEntity
from routes.user_route import get_current_user 

router = APIRouter(prefix="/comment", tags=["Comment"])

# =========================================================================
# 1. Create Comment (POST /comment/create)
# =========================================================================
@router.post("/create")
async def create_comment(
    request: Request,
    current_user: UserEntity = Depends(get_current_user)
):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}

    restaurant_id = None
    content = None
    
    # Tự động tìm dữ liệu trong JSON, Form, hoặc Query
    sources = []
    try: sources.append(await request.json())
    except: pass
    try: sources.append(await request.form())
    except: pass
    sources.append(request.query_params)

    for src in sources:
        if not restaurant_id:
            # Chấp nhận nhiều kiểu tên biến
            restaurant_id = src.get("restaurant_id") or src.get("restaurant")
        
        if not content:
            content = src.get("content") or src.get("comment")

    if not restaurant_id or not content:
        return {"success": False, "message": "Missing input data (restaurant_id, content)"}

    return await CommentService.create_comment(
        user_id=current_user.id,
        restaurant_id=str(restaurant_id),
        content=str(content)
    )

# =========================================================================
# 2. Get Comment (POST /comment/get)
# =========================================================================
@router.post("/get")
async def get_comment(request: Request):
    restaurant_id = None
    
    sources = []
    try: sources.append(await request.json())
    except: pass
    try: sources.append(await request.form())
    except: pass
    sources.append(request.query_params)

    for src in sources:
        if not restaurant_id:
            restaurant_id = src.get("restaurant_id") or src.get("restaurant")
            
    if not restaurant_id:
        return {"success": False, "message": "Missing restaurant_id"}

    return await CommentService.get_comment(restaurant_id)