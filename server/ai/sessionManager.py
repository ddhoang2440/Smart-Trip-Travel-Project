import json
import redis.asyncio as redis
from typing import Optional, Dict, Any

# Tải Docker Desktop và chạy Redis:
# docker run -d --name redis -p 6379:6379 redis
redis_client = redis.from_url("redis://localhost:6379/0", decode_responses=True)

SESSION_TTL = 3600  # TTL session 1 giờ

class SessionManager:

    @staticmethod
    async def get(user_id: str) -> Optional[Dict[str, Any]]:
        data = await redis_client.get(user_id)
        if data:
            return json.loads(data)
        return None

    @staticmethod
    async def set(user_id: str, data: Dict[str, Any]):
        # Lưu session và đặt TTL
        await redis_client.set(user_id, json.dumps(data), ex=SESSION_TTL)

    @staticmethod
    async def delete(user_id: str):
        await redis_client.delete(user_id)

    @staticmethod
    async def show_all():
        """
        Liệt kê tất cả session đang lưu trong Redis.
        """
        keys = await redis_client.keys("*")
        sessions = {}
        for key in keys:
            value = await redis_client.get(key)
            try:
                sessions[key] = json.loads(value)
            except json.JSONDecodeError:
                sessions[key] = value
        return sessions