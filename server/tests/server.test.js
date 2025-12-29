import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server.js'; // Import app đã export

describe('Server API Checks', () => {
  
  // Test route trang chủ
  it('GET / should return "Server is running ..."', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Server is running ...');
  });

  // Test thử một route không tồn tại
  it('GET /non-existent-route should return 404', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.statusCode).toEqual(404);
  });
});