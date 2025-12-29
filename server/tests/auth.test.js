import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server.js'; // Đảm bảo server.js đã export app

describe('Auth Controller', () => {
  const userData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  it('POST /auth/signup - Should create a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send(userData);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body.token).toBeDefined();
  });

  it('POST /auth/signin - Should login successfully', async () => {
    // Tạo user trước
    await request(app).post('/auth/signup').send(userData);

    const res = await request(app)
      .post('/auth/signin')
      .send({ email: userData.email, password: userData.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('POST /auth/signin - Should fail with wrong password', async () => {
    await request(app).post('/auth/signup').send(userData);

    const res = await request(app)
      .post('/auth/signin')
      .send({ email: userData.email, password: 'wrongpassword' });

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Password/i); // Kiểm tra message lỗi
  });
});