from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from config.settings import settings
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Cấu hình Hash Password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Cấu hình Token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/signin")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")

def verify_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except Exception:
        return None