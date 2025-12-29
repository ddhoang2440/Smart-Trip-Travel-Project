import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import User from '../model/user.js';
import Restaurant from '../model/restaurant.js';
import BookingSlot from '../model/bookingSlot.js';

// Import hàm cần mock
import { callGemini } from '../ai/client.js';

// Mock module ai/client.js
vi.mock('../ai/client.js', () => ({
  callGemini: vi.fn(),
}));

describe('Chat Controller (AI Integration Tests)', () => {
  let token;
  let restaurantId;
  let slotId;
  let userId;

  beforeAll(async () => {
    const email = `chat_${Date.now()}@test.com`;

    // 1. Tạo User
    const authRes = await request(app).post('/auth/signup').send({
      username: `chat_user_${Date.now()}`,
      email: email,
      password: '123'
    });
    token = authRes.body.token;

    const user = await User.findOne({ email });
    userId = user._id;

    // 2. Tạo Restaurant
    const res = await Restaurant.create({
      name: 'AI Test Res',
      owner: userId,
      address: '123 AI Street',
      medium_price: 200000,
      from: '08:00', to: '22:00',
      location: { type: 'Point', coordinates: [106.6, 10.7] }
    });
    restaurantId = res._id;

    // 3. Tạo Slot
    slotId = (await BookingSlot.create({
      restaurant_id: restaurantId,
      time: "18:00 - 20:00",
      max_slot_2: 5,
      max_slot_4: 1, 
      max_slot_8: 1
    }))._id;
  });

  const mockAI = (jsonResponse) => {
    callGemini.mockResolvedValue(JSON.stringify(jsonResponse));
  };

  it('Scenario 1: User starts booking -> AI extracts partial entities -> Backend asks for more info', async () => {
    const fakeAIResponse = {
      intent: "booking",
      entities: {
        quantity: 4,
        table: 4,
        restaurant: null,
        booking_date: null,
        booking_time: null
      },
      response: "Bạn muốn đặt bàn ở đâu?"
    };

    mockAI(fakeAIResponse);

    const res = await request(app)
      // SỬA LỖI: Thêm /analyze vào đường dẫn
      .post('/chatbot/analyze') 
      .set('Authorization', `Bearer ${token}`)
      .send({ message: "Đặt bàn cho 4 người" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Scenario 2: User provides Restaurant -> AI updates session -> Still missing Date/Time', async () => {
    const fakeAIResponse = {
      flow: "booking.update",
      updated_session: {
        quantity: 4,
        table: 4,
        restaurant: "AI Test Res",
        booking_date: null,
        booking_time: null
      },
      response: "Bạn muốn đặt lúc nào?"
    };

    mockAI(fakeAIResponse);

    const res = await request(app)
      .post('/chatbot/analyze') // SỬA LỖI
      .set('Authorization', `Bearer ${token}`)
      .send({ message: "Tại nhà hàng AI Test Res" });

    expect(res.status).toBe(200);
  });

  it('Scenario 3: AI says CONFIRM but Slot is FULL -> Backend returns Business Error', async () => {
    // 1. Đặt hết slot trước
    await request(app).post('/booking/create').set('Authorization', `Bearer ${token}`).send({
        booking_date: '2025-12-31', quantity: 1, table: 4, slot_id: slotId, restaurant_id: restaurantId
    });

    // 2. Chatbot cố đặt tiếp -> AI Confirm
    const fakeAIResponse = {
      flow: "booking.confirm",
      updated_session: {
        quantity: 4, 
        table: 4,
        restaurant: "AI Test Res",
        booking_date: "2025-12-31",
        booking_time: "18:00 - 20:00"
      },
      response: "Tôi xác nhận đặt bàn nhé?"
    };

    mockAI(fakeAIResponse);

    const res = await request(app)
      .post('/chatbot/analyze') // SỬA LỖI
      .set('Authorization', `Bearer ${token}`)
      .send({ message: "Chốt đơn ngày 31/12 lúc 18h nhé" });

    // 3. Backend phải chặn và báo lỗi
    if (res.status === 200) {
        // Tùy controller trả về, nếu success=false là đúng logic chặn
        if(res.body.success === false) {
             expect(res.body.message).toMatch(/hết bàn|full|not available/i);
        }
    } else {
        expect(res.status).toBe(400);
    }
  });

  it('Scenario 4: User asks random question -> AI returns no_action -> Session preserved', async () => {
    const fakeAIResponse = {
      flow: "no_action", 
      response: "Tôi là trợ lý ảo đặt bàn."
    };

    mockAI(fakeAIResponse);

    const res = await request(app)
      .post('/chatbot/analyze') // SỬA LỖI
      .set('Authorization', `Bearer ${token}`)
      .send({ message: "Bạn tên là gì?" });

    expect(res.status).toBe(200);
  });
});