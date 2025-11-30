from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGOOSE_URL: str
    PORT: int = 3000
    SECRET_KEY: str # Khóa bí mật dùng để mã hóa và giải mã token (JWT)
    CLOUDINARY_CLOUD_NAME: str # Cấu hình kết nối với dịch vụ lưu trữ ảnh Cloudinary.
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()