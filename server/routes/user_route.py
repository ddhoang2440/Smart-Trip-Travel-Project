from fastapi import APIRouter, Depends, File, UploadFile, Form, Header
from typing import Optional
from bson import ObjectId
from models.user_model import SignUpRequest, SignInRequest, ForgotPasswordRequest, ResetPasswordRequest
from services.user_service import UserService
from config.security import verify_token
from entities.user_entity import UserEntity

router = APIRouter(prefix="/auth", tags=["User"])

# =========================================================================
# MIDDLEWARE: Lấy User từ Token
# =========================================================================
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Hàm này sẽ tự động chạy trước các route cần bảo vệ.
    Nó lấy token từ Header 'Authorization', giải mã và tìm User trong DB.
    """
    if not authorization:
        return None
    
    try:
        # Format chuẩn: "Bearer <token>"
        if not authorization.startswith("Bearer "):
            return None
            
        token = authorization.split(" ")[1]
        payload = verify_token(token)
        
        if not payload: 
            return None
        
        user_id = payload.get("sub")
        # Tìm user trong DB bằng ID
        user = await UserEntity.get(ObjectId(user_id))
        return user
    except Exception as e:
        print(f"Auth Middleware Error: {e}")
        return None

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

# 5. Quên mật khẩu (POST /auth/forgot-password)
@router.post("/forgot-password")
async def forgetPassword(data: ForgotPasswordRequest):
    return await UserService.forget_password(data.email)

# 5. Reset mật khẩu (POST /auth/reset-password)
@router.post("/reset-password")
async def resetPassword(data: ResetPasswordRequest):
    return await UserService.reset_password(data.token, data.new_password)
