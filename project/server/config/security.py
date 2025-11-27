from passlib.context import CryptContext # Dùng để băm (hash) mật khẩu.
from jose import jwt #  Dùng để tạo và giải mã JSON Web Token (JWT).
from datetime import datetime, timedelta
from config.settings import settings
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Cấu hình Hash Password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Cấu hình Token
'''Khi Frontend gửi request (ví dụ: lấy danh sách đơn hàng), họ sẽ gửi kèm Token trong Header theo định dạng chuẩn quốc tế:
Authorization: Bearer <chuỗi_token_loằng_ngoằng>
OAuth2PasswordBearer se lam : Tự động "móc" Token ra từ Header -) token sach -) Tự động chặn cửa (Validation)(neu khong co token hoac gui sai dinh dang) rả về lỗi 401 Unauthorized  -) Tự động tạo nút "Login" trên trang tài liệu (Swagger UI) -) Đây là tính năng cực hay của FastAPI.
Tham số tokenUrl="auth/signin" bạn truyền vào có ý nghĩa là: "Này Swagger UI, nếu ai muốn lấy token thì hãy chỉ họ đến đường dẫn /auth/signin nhé". nghia la ra dang ky hay dang nhap de lay token a'''
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/signin")

def hash_password(password: str) -> str: # Biến mật khẩu thô (ví dụ: "123456") thành chuỗi mã hóa an toàn (bcrypt) để lưu vào database.
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool: # check mk co khop voi db
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict): # Tạo ra một chuỗi token khi user đăng nhập thành công. Token này chứa thông tin user và thời gian hết hạn (ở đây set là 30 ngày). cach dang nhap hien dai, no se khac voi session la phai kt database moi lan request, ma jwt se dung token 1 lan tao va tra ve client, moi lan clietn gui request se gui dung token do roi decode nhan dang thoi
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def verify_token(token: str): # Giải mã token gửi lên từ phía client để xem user là ai và token còn hạn hay không.
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except Exception:
        return None