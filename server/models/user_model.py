from pydantic import BaseModel
from typing import Optional

# Model cho API Sign In
class SignInRequest(BaseModel):
    email: str
    password: str

# Model cho API Sign Up
class SignUpRequest(BaseModel):
    username: str
    email: str
    password: str