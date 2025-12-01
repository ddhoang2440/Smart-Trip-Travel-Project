from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import init_db
from routes import user_route, restaurant_route, menu_route, comment_route, voucher_route, order_route, contact_route,booking_route,search_route
import uvicorn
from ai import chat_route

app = FastAPI()

# Config CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_origins=["http://localhost:5173"],    
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kết nối DB khi khởi động
@app.on_event("startup")
async def start_db():
    await init_db()
    print("Connect to mongoDb succesfully!") # Giữ nguyên thông báo cũ

@app.get("/")
async def root():
    return "Server is running ..."

# Đăng ký Route
app.include_router(user_route.router)
app.include_router(restaurant_route.router)
app.include_router(menu_route.router)
app.include_router(comment_route.router)
app.include_router(voucher_route.router)
app.include_router(order_route.router)
app.include_router(contact_route.router)
app.include_router(chat_route.router)
app.include_router(booking_route.router)
app.include_router(search_route.router)
# app.include_router(chatbot_route.router)

if __name__ == "__main__":
    # Chạy server tại port 3000
    uvicorn.run("main:app", host="127.0.0.1", port=3000, reload=True)
