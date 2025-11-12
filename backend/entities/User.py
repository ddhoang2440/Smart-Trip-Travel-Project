from pydantic import BaseModel, EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInformation(BaseModel):
    user_id: str
    email: EmailStr