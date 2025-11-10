from fastapi import APIRouter, Depends, HTTPException
from controllers.authController import signup_user, login_user, logout_user, blacklist, UserDTO
from fastapi_jwt_auth import AuthJWT

user_service = APIRouter()

@user_service.post("/signup")
def signup(data: UserDTO):
    user_id, email = signup_user(data.email, data.password)
    return {"email": email, "user_id": user_id}

@user_service.post("/login")
def login(data: UserDTO, Authorize: AuthJWT = Depends()):
    token = login_user(data.email, data.password, Authorize)
    return {"email": data.email, "token": token}

@user_service.post("/logout")
def logout(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    jti = Authorize.get_raw_jwt()["jti"]
    return logout_user(jti)


@user_service.get("/protected")
def protected(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
        jti = Authorize.get_raw_jwt()["jti"]
        if jti in blacklist:
            raise HTTPException(status_code=401, detail="Token has been revoked")
        user_id = Authorize.get_jwt_subject()
        return {"message": "Access granted", "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))