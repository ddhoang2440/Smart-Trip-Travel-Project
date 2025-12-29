import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import Restaurant from '../model/restaurant.js';
import User from '../model/user.js';
import Menu from '../model/food.js';

describe('Menu Controller', () => {
  let token;
  let restaurantId;

  beforeAll(async () => {
    // Tạo User
    const userRes = await request(app).post('/auth/signup').send({
      username: `chef_${Date.now()}`,
      email: `chef_${Date.now()}@test.com`,
      password: '123'
    });
    token = userRes.body.token;
    
    // Lấy ID thật
    const user = await User.findOne({ email: userRes.body.user.email });

    // Tạo Restaurant
    const res = await Restaurant.create({
      name: 'Menu Test Res',
      owner: user._id,
      address: 'Test Addr',
      from: '08:00', to: '22:00',
      location: { type: 'Point', coordinates: [0, 0] }
    });
    restaurantId = res._id;
  });

  beforeEach(async () => {
    await Menu.deleteMany({});
  });

  it('POST /menu/create - Should create food item successfully', async () => {
    const res = await request(app)
      .post('/menu/create')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Pho Bo')
      .field('price', '50000')
      .field('description', 'Delicious')
      .field('restaurant', restaurantId.toString()) 
      .field('type', 'Main') 
      .attach('image', Buffer.from('fake-img'), 'food.jpg');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /menu/restaurant - Should return menu of a restaurant', async () => {
    // Tạo data mẫu
    await Menu.create({
      name: 'Bun Cha',
      price: 30000,
      description: 'Hanoi special',
      type: 'Main',
      restaurant: restaurantId, 
      image: 'img.url'
    });

    // SỬA TẠI ĐÂY: Dùng đúng route /menu/restaurant như trong menuRoute.js
    const res = await request(app)
      .post('/menu/restaurant') 
      .send({ restaurant_id: restaurantId });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Kiểm tra kết quả
    expect(res.body.restaurantmenu).toBeDefined();
    expect(res.body.restaurantmenu.length).toBeGreaterThan(0);
  });
});