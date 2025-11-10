from fastapi import HTTPException, status
from models.User import users
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from bson import ObjectId
from pydantic import BaseModel, EmailStr

context = CryptContext(schemes=["bcrypt"], deprecated="auto")
blacklist = set()

#DTO for user data
class UserDTO(BaseModel):
    email: EmailStr
    password: str

#Sign up
def signup_user(email: str, password: str):
    try:
        if users.find_one({"email": email}):
            raise HTTPException(status_code=400, detail="Email đã tồn tại")
        hashed = context.hash(password)
        new_user = {"email": email, "password": hashed}
        result = users.insert_one(new_user)
        user_id = str(result.inserted_id)
        return user_id, email
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Login
def login_user(email: str, password: str, Authorize: AuthJWT):
    try:
        user = users.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=400, detail="Email không tồn tại")
        if not context.verify(password, user["password"]):
            raise HTTPException(status_code=401, detail="Sai mật khẩu")
        token = Authorize.create_access_token(subject=str(user["_id"]))
        return token
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Logout
def logout_user(jti: str):
    try:
        blacklist.add(jti)
        return {"message": "Logout thành công"}, 200
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))