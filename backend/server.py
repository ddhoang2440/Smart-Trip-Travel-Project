from fastapi import FastAPI
from pydantic import BaseModel
from fastapi_jwt_auth import AuthJWT
import os
from dotenv import load_dotenv

from routes.userRoute import user_service
from routes.restaurantRoute import restaurant_service  
from routes.menuRoute import menu_service 

load_dotenv()

app = FastAPI(title="Smart Trip Travel")
app.state.JWT_SECRET_KEY = os.getenv("JWT_SECRET")

# Đăng ký Blueprint
app.include_router(user_service, prefix="/api/user")
app.include_router(restaurant_service, prefix="/api/restaurant")
app.include_router(menu_service, prefix="/api/menu")

if __name__ == "__main__":
    app.run(debug=True)
