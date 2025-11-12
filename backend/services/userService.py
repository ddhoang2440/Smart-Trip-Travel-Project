from fastapi import HTTPException, status
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from bson import ObjectId

from models.userModel import users
from entities.User import UserLogin, UserInformation

context = CryptContext(schemes=["bcrypt"], deprecated="auto")
blacklist = set()

#Sign up
def signup_service(user: UserLogin):
    try:
        if users.find_one({"email": user.email}):
            raise HTTPException(status_code=400, detail="Email đã tồn tại")
        hashed = context.hash(user.password)
        new_user = {"email": user.email, "password": hashed}
        result = users.insert_one(new_user)
        id = str(result.inserted_id)
        return UserInformation(user_id = id, email = user.email)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Login
def login_service(user: UserLogin, Authorize: AuthJWT):
    try:
        user = users.find_one({"email": user.email})
        if not user:
            raise HTTPException(status_code=400, detail="Email không tồn tại")
        if not context.verify(user.password, user["password"]):
            raise HTTPException(status_code=401, detail="Sai mật khẩu")
        token = Authorize.create_access_token(subject=str(user["_id"]))
        return token
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Logout
def logout_service(jti: str):
    try:
        blacklist.add(jti)
        return {"message": "Logout thành công"}, 200
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))