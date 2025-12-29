import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import Restaurant from '../model/restaurant.js';

describe('Restaurant Controller', () => {
  let token;

  beforeAll(async () => {
    // Quan trọng: Tạo index 2dsphere thủ công cho Collection
    // createIndexes của Mongoose đôi khi không chạy kịp trong môi trường Test
    await Restaurant.collection.createIndex({ location: '2dsphere' });
  });

  beforeEach(async () => {
     // Đăng ký user để lấy token (Chạy trước mỗi test hoặc beforeAll đều được, 
     // nhưng nếu setup.js xóa User thì nên để ở đây)
     const res = await request(app).post('/auth/signup').send({
      username: `owner_${Date.now()}`,
      email: `owner_${Date.now()}@test.com`,
      password: '123'
    });
    token = res.body.token;
  });

  it('POST /restaurant/create - Should create restaurant with images', async () => {
    const res = await request(app)
      .post('/restaurant/create')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test Restaurant')
      .field('type', 'Asian')
      .field('medium_price', '200000')
      .field('from', '08:00')
      .field('to', '22:00')
      .field('address', '123 Test Street')
      .field('description', 'Best food')
      // Format đúng GeoJSON
      .field('location', JSON.stringify({ type: 'Point', coordinates: [106.6, 10.7] }))
      .attach('images', Buffer.from('fake image'), 'test.jpg');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /restaurant/getall - Should return restaurants', async () => {
    // Tạo data giả trước khi get (Vì setup.js đã xóa data của test trên)
    await Restaurant.create({
        name: 'Res For Get',
        owner: '60d0fe4f5311236168a109ca', // Dummy ID
        type: 'Asian',
        medium_price: 100,
        address: 'HCM', from: '8', to: '10',
        location: { type: 'Point', coordinates: [106.6, 10.7] }
    });

    const res = await request(app)
      .post('/restaurant/getall')
      .send({ latitude: 10.7, longitude: 106.6 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.restaurants)).toBe(true);
    // Có thể check thêm length > 0
  });
});