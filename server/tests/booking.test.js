import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import BookingSlot from '../model/bookingSlot.js';
import Restaurant from '../model/restaurant.js';
import User from '../model/user.js'; 

describe('Booking Controller', () => {
  let token;
  let restaurantId;
  let slotId;

  beforeEach(async () => {
    const email = `diner_${Date.now()}@test.com`;

    // 1. Đăng ký User
    const authRes = await request(app).post('/auth/signup').send({
      username: `diner_${Date.now()}`,
      email: email,
      password: '123'
    });
    token = authRes.body.token;

    // 2. Lấy _id thật từ Database
    const user = await User.findOne({ email });
    const userId = user._id;

    // 3. Tạo Restaurant
    const restaurant = await Restaurant.create({
      name: 'Booking Res',
      owner: userId, 
      type: 'B',
      medium_price: 100,
      from: '08:00',
      to: '22:00',
      address: 'Addr',
      description: 'Desc',
      location: { type: 'Point', coordinates: [106.6, 10.7] },
      images: ['img.jpg']
    });
    restaurantId = restaurant._id;

    // 4. Tạo Booking Slot (Max 2 bàn loại 4)
    const slotData = {
      restaurant_id: restaurantId,
      time: "08:00 - 10:00",
      max_slot_2: 5,
      max_slot_4: 2, // Chỉ có 2 bàn
      max_slot_8: 1
    };
    const slot = await BookingSlot.create(slotData);
    slotId = slot._id;
  });

  it('POST /booking/create - Should book successfully if table available', async () => {
    const res = await request(app)
      .post('/booking/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        booking_date: '2025-01-01',
        quantity: 1, // SỬA: Đặt 1 bàn (Table 4) thay vì quantity 4
        table: 4,
        slot_id: slotId,
        restaurant_id: restaurantId
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /booking/create - Should fail if over capacity', async () => {
    // Đặt bàn 1
    await request(app).post('/booking/create').set('Authorization', `Bearer ${token}`).send({
        booking_date: '2025-01-01', quantity: 1, table: 4, slot_id: slotId, restaurant_id: restaurantId
    });
    
    // Đặt bàn 2 (Lúc này đã Full 2/2 bàn)
    await request(app).post('/booking/create').set('Authorization', `Bearer ${token}`).send({
        booking_date: '2025-01-01', quantity: 1, table: 4, slot_id: slotId, restaurant_id: restaurantId
    });

    // Đặt bàn 3 -> Phải fail
    const res = await request(app)
      .post('/booking/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        booking_date: '2025-01-01',
        quantity: 1,
        table: 4,
        slot_id: slotId,
        restaurant_id: restaurantId
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Hết Bạn Loại 4 người/); 
  });
});