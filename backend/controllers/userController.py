from fastapi import Depends, HTTPException
from fastapi_jwt_auth import AuthJWT

from services.userService import signup_service, login_service, logout_service, blacklist
from entities.User import UserLogin

# Signup
def signup_control(data: UserLogin):
    return signup_service(data)

# Login
def login_control(data: UserLogin, Authorize: AuthJWT = Depends()):
    return login_service(data, Authorize)

# Logout
def logout_control(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    jti = Authorize.get_raw_jwt()["jti"]
    return logout_service(jti)

# Protected
def protected_control(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
        jti = Authorize.get_raw_jwt()["jti"]
        if jti in blacklist:
            raise HTTPException(status_code=401, detail="Token has been revoked")
        user_id = Authorize.get_jwt_subject()
        return {"message": "Access granted", "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))