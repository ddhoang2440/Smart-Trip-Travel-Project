from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGOOSE_URL: str
    PORT: int = 3000
    SECRET_KEY: str
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()