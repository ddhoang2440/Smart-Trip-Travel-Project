import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

// 1. Mock Cloudinary
vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload: vi.fn().mockResolvedValue({
        secure_url: 'http://res.cloudinary.com/mock-url/image.jpg',
        public_id: 'mock-id'
      }),
      destroy: vi.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

// 2. Mock IORedis (ĐÃ SỬA LỖI)
// Sử dụng 'function' thường thay vì arrow function để hỗ trợ 'new Redis()'
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return {
        get: vi.fn().mockResolvedValue(null),
        set: vi.fn().mockResolvedValue('OK'),
        del: vi.fn().mockResolvedValue(1),
        keys: vi.fn().mockResolvedValue([]),
        // Thêm các hàm khác nếu code bạn có dùng (vd: on, connect...)
        on: vi.fn(),
        connect: vi.fn(),
      };
    }),
  };
});

// 3. Kết nối Database ảo
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// 4. Xóa dữ liệu sau mỗi bài test
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// 5. Ngắt kết nối
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});