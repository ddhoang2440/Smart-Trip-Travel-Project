from fastapi import APIRouter

from controllers.userController import signup_control, login_control, logout_control, verify_control, get_info_control, update_info_control
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

@user_service.get("/verify")
def verify(Authorize):
    return verify_control(Authorize)

@user_service.get("/{user_id}/info")
def get_info(user_id):
    return get_info_control(user_id)

@user_service.post("/{user_id}/info/update")
def update_info(user_id: str, contact: str = None, 
                allergy: list[str] = None, 
                image_url: str = None):
    return update_info_control(user_id, contact, allergy, image_url)