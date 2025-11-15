from fastapi import APIRouter, Depends
from fastapi_jwt_auth import AuthJWT

from controllers.userController import signup_control, login_control, logout_control, verify_control, get_info_control, update_info_control
from entities.User import UserLogin, Settings, UserUpdatable

user_service = APIRouter()

@AuthJWT.load_config
def get_config():
    return Settings()

@user_service.post("/signup")
def signup(data: UserLogin):
    return signup_control(data)

@user_service.post("/login")
def login(data: UserLogin, Authorize: AuthJWT = Depends()):
    return login_control(data, Authorize)

@user_service.post("/logout")
def logout(Authorize: AuthJWT = Depends()):
    return logout_control(Authorize)

@user_service.get("/verify")
def verify(Authorize: AuthJWT = Depends()):
    return verify_control(Authorize)

@user_service.get("/{user_id}/info")
def get_info(user_id):
    return get_info_control(user_id)

@user_service.post("/{user_id}/info/update")
def update_info(user_id: str, data: UserUpdatable):
    return update_info_control(user_id, data)