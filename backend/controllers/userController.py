from fastapi import HTTPException
from fastapi_jwt_auth import AuthJWT
from typing import Optional

from services.userService import signup_service, login_service, logout_service, verify_token_service, get_info_service, update_info_service
from entities.User import UserLogin, UserUpdatable

# Signup
def signup_control(data: UserLogin):
    try:
        result = signup_service(data)
        if result == "exists":
            raise HTTPException(status_code=400, detail="Email already exists")
        return {
            "message": "Signup successful", 
            "user": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Login
def login_control(data: UserLogin, Authorize: AuthJWT):
    try:
        result = login_service(data, Authorize)
        if result == "notfound":
            raise HTTPException(status_code=400, detail="Email not found")
        if result == "wrongpassword":
            raise HTTPException(status_code=401, detail="Incorrect password")
        return {
            "message": "Login successful",
            "access_token": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Logout
def logout_control(Authorize: AuthJWT):
    try:
        Authorize.jwt_required()
        jti = Authorize.get_raw_jwt()["jti"]
        result = logout_service(jti)
        if result == "success":
            return {"message": "Logout successful"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Verify token
def verify_control(Authorize: AuthJWT):
    try:
        result = verify_token_service(Authorize)
        if result == "invalid":
            raise HTTPException(status_code=400, detail="Invalid token")
        if result == "revoked":
            raise HTTPException(status_code=401, detail="Token has been revoked")
        return {"message": "Success", "user_id": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Get information
def get_info_control(user_id: str):
    try:
        user = get_info_service(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "Success", "user": user}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Update information
def update_info_control(user_id: str, data: UserUpdatable):
    try:
        result = update_info_service(user_id, data)
        if result == "invalid":
            raise HTTPException(status_code=400, detail="Invalid input data")
        if result == "notfound":
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "Update successful", "user": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))