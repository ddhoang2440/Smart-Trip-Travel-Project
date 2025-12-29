import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import Restaurant from '../model/restaurant.js';
import User from '../model/user.js';
import Comment from '../model/comment.js';

describe('Comment Controller', () => {
  let token;
  let restaurantId;
  let userId;

  beforeEach(async () => {
    const email = `reviewer_${Date.now()}@test.com`;
    
    // 1. Tạo User
    const authRes = await request(app).post('/auth/signup').send({
      username: `reviewer_${Date.now()}`,
      email: email,
      password: '123'
    });
    token = authRes.body.token;
    
    // Lấy ID user
    const user = await User.findOne({ email });
    userId = user._id;

    // 2. Tạo Restaurant
    const res = await Restaurant.create({
      name: 'Review Res',
      owner: userId,
      address: 'Test Addr',
      from: '8', to: '10',
      location: { type: 'Point', coordinates: [0, 0] }
    });
    restaurantId = res._id;
  });

  it('POST /comment/create - Should add a comment/review', async () => {
    const res = await request(app)
      .post('/comment/create')
      .set('Authorization', `Bearer ${token}`)
      // Quan trọng: toString() để đảm bảo gửi string
      .field('restaurant_id', restaurantId.toString())
      .field('rating', 5)
      .field('content', 'Excellent food!')
      .attach('images', Buffer.from('review-img'), 'review.jpg');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Successfully');
  });

  it('GET /comment/get - Should return comments for a restaurant', async () => {
    // 1. Tạo comment giả (Seed Data)
    await Comment.create({
      restaurant_id: restaurantId,
      user_id: userId,
      content: "Seed comment for testing",
      rating: 4,
      images: []
    });

    // 2. Gọi API lấy comment
    const res = await request(app)
      .get('/comment/get') 
      .query({ restaurant_id: restaurantId.toString() });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    
    // Kiểm tra độ dài mảng comment
    expect(res.body.comment.length).toBeGreaterThan(0);
    expect(res.body.comment[0].content).toBe('Seed comment for testing');
  });
});