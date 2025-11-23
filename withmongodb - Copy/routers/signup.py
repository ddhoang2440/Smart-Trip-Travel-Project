from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database.Database import get_db
from models.user import User
import bcrypt
import uuid

app = FastAPI()
db = get_db()

# --- Request model cho signup ---
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

# --- Request model cho login ---
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/signup")
def signup(data: SignupRequest):
    # Kiểm tra email đã tồn tại chưa
    existing_user = db.filter("users", User, email=data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    
    # Sinh UUID4 cho user
    user_id = str(uuid.uuid4())
    
    # Hash password
    hashed_password = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    
    user_record = User(
        id=user_id,
        name=data.name,
        email=data.email,
        password=hashed_password
    )
    
    db.insert("users", user_record)
    return {"message": "Signup thành công!", "user_id": user_id}

@app.post("/login")
def login(data: LoginRequest):
    users = db.filter("users", User, email=data.email)
    if not users:
        raise HTTPException(status_code=400, detail="Email không tồn tại")
    
    user = users[0]
    
    if not bcrypt.checkpw(data.password.encode(), user.password.encode()):
        raise HTTPException(status_code=400, detail="Password không đúng")
    
    return {"message": f"Login thành công! Xin chào {user.name}", "user_id": user.id}
