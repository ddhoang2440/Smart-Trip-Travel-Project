from fastapi import APIRouter, Depends, File, UploadFile, Form, Header
from typing import Optional
from bson import ObjectId
from fastapi import Header, HTTPException, status
from bson import ObjectId

from models.user_model import SignUpRequest, SignInRequest
from services.user_service import UserService
from config.security import verify_token
from entities.user_entity import UserEntity

router = APIRouter(prefix="/auth", tags=["User"])

# =========================================================================
# MIDDLEWARE: Lấy User từ Token
# =========================================================================
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    try:
        # Format: "Bearer <token>"
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=401,
                detail="Invalid token format"
            )
        
        token = authorization.split(" ")[1]
        payload = verify_token(token)

        if not payload:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        user_id = payload.get("sub")
        user = await UserEntity.get(ObjectId(user_id))

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )
        print(user)
        return user

    except Exception as e:
        print("Auth Middleware Error:", e)
        raise HTTPException(
            status_code=401,
            detail="Authentication failed"
        )

# =========================================================================
# ROUTES
# =========================================================================

# 1. Đăng nhập (POST /auth/signin)
@router.post("/signin")
async def signin(data: SignInRequest):
    return await UserService.signin_service(data)

# 2. Đăng ký (POST /auth/signup)
@router.post("/signup")
async def signup(data: SignUpRequest):
    return await UserService.signup_service(data)

# 3. Cập nhật Profile (POST /auth/profile)
# Lưu ý: Dùng Form(...) và File(...) để nhận multipart/form-data
@router.post("/profile")
async def profile(
    username: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
    contact: Optional[str] = Form(None),
    allergy: Optional[str] = Form(None),
    image: UploadFile = File(None),
    current_user: UserEntity = Depends(get_current_user)
):
    # Kiểm tra đăng nhập
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}
    
    # Gọi service xử lý logic
    return await UserService.update_profile(
        current_user, 
        username, 
        password, 
        contact, 
        allergy, 
        image
    )

# 4. Kiểm tra Token (GET /auth/check)
@router.get("/check")
async def check(current_user: UserEntity = Depends(get_current_user)):
    # Service tự check user null hay không
    return await UserService.auth_check(current_user)

# 5. Xóa tài khoản (GET /auth/delete)
@router.get("/delete")
async def delete(current_user: UserEntity = Depends(get_current_user)):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}
         
    return await UserService.auth_delete(current_user)