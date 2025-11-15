from fastapi import status
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from bson import ObjectId
from datetime import datetime

from models.userModel import users
from entities.User import UserLogin, UserInformation, UserUpdatable

context = CryptContext(schemes=["bcrypt"], deprecated="auto")
blacklist = set()

#Sign up
def signup_service(user: UserLogin):
    try:
        if users.find_one({"email": user.email}):
            return "exists"
        hashed = context.hash(user.password)

        new_user = {"email": user.email, "password": hashed}
        result = users.insert_one(new_user)
        id = str(result.inserted_id)

        return UserInformation(user_id = id, email = user.email)
    except Exception as e:
        raise e

#Login
def login_service(data: UserLogin, Authorize: AuthJWT):
    try:
        user = users.find_one({"email": data.email})
        if not user:
            return "notfound"
        
        if not context.verify(data.password, user["password"]):
            return "wrongpassword"
        token = Authorize.create_access_token(subject=str(user["_id"]))
        return token
    except Exception as e:
        raise e
    
#Logout
def logout_service(jti: str):
    try:
        blacklist.add(jti)
        return "success"
    except Exception as e:
        raise e
    
# Verify token
def verify_token_service(Authorize: AuthJWT):
    try:
        Authorize.jwt_required()
    except Exception:
        return "invalid"
    jti = Authorize.get_raw_jwt()["jti"]
    if jti in blacklist:
        return "revoked"
    user_id = Authorize.get_jwt_subject()
    return user_id

# Get information
def get_info_service(user_id: str):
    try:
        user = users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
        if not user:
            return None
        return UserInformation(**user)
    except Exception as e:
        raise e

# Update information
def update_info_service(user_id: str, user_info: UserUpdatable):
    try:
        data = user_info.dict(exclude_unset=True)
        if not data:
            return "invalid"
        data['updated_at'] = datetime.utcnow()
        result = users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": data}
        )
        if result.matched_count == 0:
            return "notfound"
        updated_user = get_info_service(user_id)
        return updated_user
    except Exception as e:
        raise e
