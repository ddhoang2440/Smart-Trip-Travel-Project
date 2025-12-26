import Redis from "ioredis";

// Tải Docker Desktop và chạy Redis:
// docker run -d --name redis -p 6379:6379 redis

const redisClient = new Redis("redis://localhost:6379/0");

const SESSION_TTL = 3600; // TTL 1 giờ

export default class SessionManager {
  // ===============================
  //  Lấy session
  // ===============================
  static async get(userId) {
    const data = await redisClient.get(userId);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("JSON parse error:", e);
      return null;
    }
  }

  // ===============================
  //  Lưu session + TTL
  // ===============================
  static async set(userId, data) {
    await redisClient.set(userId, JSON.stringify(data), "EX", SESSION_TTL);
  }

  // ===============================
  //  Xóa session
  // ===============================
  static async delete(userId) {
    await redisClient.del(userId);
  }

  // ===============================
  //  Liệt kê tất cả session
  // ===============================
  static async showAll() {
    const keys = await redisClient.keys("*");

    const sessions = {};

    for (const key of keys) {
      const value = await redisClient.get(key);

      try {
        sessions[key] = JSON.parse(value);
      } catch {
        sessions[key] = value;
      }
    }

    return sessions;
  }
}
