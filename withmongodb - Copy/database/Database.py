from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os
from dotenv import load_dotenv

'''Lớp MongoDB

Đây là class quản lý kết nối:
connect()
close()
get_collection()'''
# Load environment variables
load_dotenv()
'''load_dotenv() giúp Python đọc file .env, để bạn có thể dùng os.getenv() lấy biến cấu hình (URL database, API key...).'''
# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "restaurant_db")
MAX_POOL_SIZE = int(os.getenv("MAX_POOL_SIZE", "10"))
MIN_POOL_SIZE = int(os.getenv("MIN_POOL_SIZE", "1"))

class MongoDB:
    """MongoDB Database Handler with async support"""
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
    
    async def connect(self):
        """Connect to MongoDB with proper configuration"""
        try:
            self.client = AsyncIOMotorClient(
                MONGODB_URL,
                maxPoolSize=MAX_POOL_SIZE,
                minPoolSize=MIN_POOL_SIZE,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
                retryWrites=True,
                w='majority'
            )
            
            self.db = self.client[DATABASE_NAME]
            
            # Test connection
            await self.client.admin.command('ping')
            print(f"Connected to MongoDB: {DATABASE_NAME}")
            print(f"Connection URL: {MONGODB_URL.split('@')[-1] if '@' in MONGODB_URL else 'localhost'}")
            
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")
            raise
    
    async def close(self):
        """Close MongoDB connection properly"""
        if self.client:
            self.client.close()
            print(" MongoDB connection closed")
    
    def get_collection(self, collection_name: str):
        """Get a collection from database"""
        if self.db is None:
            raise RuntimeError("Database not connected. Call connect() first.")
        return self.db[collection_name]
    
    async def ping(self) -> bool:
        """Check if database connection is alive"""
        try:
            await self.client.admin.command('ping')
            return True
        except Exception:
            return False

# Global MongoDB instance -) Dùng để lưu lại kết nối MongoDB sau khi server khởi động.
_mongodb_instance: Optional[MongoDB] = None

async def connect_to_mongo():
    """Initialize MongoDB connection"""
    global _mongodb_instance
    _mongodb_instance = MongoDB()
    await _mongodb_instance.connect()

async def close_mongo_connection():
    """Close MongoDB connection"""
    global _mongodb_instance
    if _mongodb_instance:
        await _mongodb_instance.close()

def get_database() -> MongoDB:
    """Get MongoDB instance (sync version for compatibility)"""
    global _mongodb_instance
    if _mongodb_instance is None:
        raise RuntimeError("Database not connected. Call connect_to_mongo() first.")
    return _mongodb_instance

async def get_db():
    """Dependency for FastAPI routes (async version)"""
    return get_database()

#from motor.motor_asyncio import AsyncIOMotorClient
'''Đặc điểm

Là MongoDB driver hỗ trợ async dành riêng cho FastAPI.
Dùng trong các route async def.
Không làm block server.
Tối ưu cho backend có nhiều request cùng lúc.
✔ Ưu điểm

Rất phù hợp cho FastAPI (vì FastAPI bản chất async).
Hiệu năng cao.
Không làm “đứng” thread chính khi truy vấn database.
Dễ mở rộng, dùng connection pool, retryWrites, ping kiểm tra kết nối.
✔ Nhược điểm

Code phức tạp hơn.
Phải dùng await cho mọi thao tác DB.'''