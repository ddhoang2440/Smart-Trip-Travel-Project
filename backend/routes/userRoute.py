from fastapi import APIRouter

from controllers.userController import signup_control, login_control, logout_control, protected_control
from entities.User import UserLogin

user_service = APIRouter()

@user_service.post("/signup")
def signup(data: UserLogin):
    return signup_control(data)

@user_service.post("/login")
def login(data: UserLogin):
    return login_control(data)

@user_service.post("/logout")
def logout(Authorize):
    return logout_control(Authorize)

@user_service.get("/protected")
def protected(Authorize):
    return protected_control(Authorize)