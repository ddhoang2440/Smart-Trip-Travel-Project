# Mô tả dữ liệu trả về từ NLU Prompt

## 1. Cấu trúc JSON chính

Dữ liệu trả về là một **mảng JSON** (`JSON array`) chứa một hoặc nhiều đối tượng. Mỗi đối tượng mô tả một intent được phát hiện từ người dùng.

### Object schema

```json
{
  "intent": "search" | "booking" | "pay" | "suggest" | "schedule" | "compare" | "history" | "modify" | "cancel" | "other",
  "type": "ui_action" | "reply" | "no_response",
  "entities": "restaurant" | "menu" | "food" | null,
  "fields": { /* các slot, tùy intent */ },
  "intent_confidence": 0.0 - 1.0,
  "nlp_meta": {
    "keyword_override": true | false,
    "clarify_required": true | false,
    "missing_slots": [ "slot_name", ... ],
    "low_confidence_slots": [ "slot_name", ... ]
  }
}
```

> Nếu không phát hiện intent nào, trả về:

```json
[
  {
    "intent": "other",
    "type": "no_response",
    "entities": null,
    "fields": {}
  }
]
```

---

## 2. Các intent và fields chính

### a. `search`

Tìm kiếm nhà hàng hoặc món ăn.

```json
{
  "query": slot,
  "res_name": slot,
  "cuisine": slot,
  "location": slot,
  "price_range": {
    "value": { "min": number|null, "max": number|null },
    "canonical": "low"|"medium"|"high"|null,
    "confidence": 0.0,
    "source": "",
    "raw": ""
  },
  "rating": slot,
  "open_now": slot,
  "distance_km": slot,
  "tags": slot,
  "filters": object|null,
  "slots": object
}
```

### b. `booking`

Đặt bàn tại nhà hàng.

```json
{
  "restaurant": slot,
  "restaurant_id": slot|null,
  "time": { "from": string|null, "to": string|null },
  "date": { "day": int|null, "month": int|null, "year": int|null },
  "people": slot,
  "contact_name": slot,
  "contact_phone": slot,
  "special_request": slot,
  "slots": object
}
```

### c. `pay`

Thanh toán hóa đơn.

```json
{
  "payment_type": slot,
  "amount": slot,
  "currency": slot,
  "order_id": slot,
  "res_name": slot,
  "note": slot
}
```

### d. `suggest`

Gợi ý món ăn hoặc nhà hàng dựa trên sở thích, ngân sách, dịp, ...

```json
{
  "cuisine": slot,
  "taste": slot,
  "occasion": slot,
  "budget_per_person": slot,
  "location": slot,
  "time_of_day": slot,
  "popularity": slot,
  "filters": object|null,
  "slots": object
}
```

### e. `schedule`, `compare`, `history`, `modify`, `cancel`

Các intent liên quan tới lịch trình, so sánh nhà hàng, lịch sử, thay đổi hoặc hủy đặt bàn. Mỗi intent có fields riêng tương ứng với mục đích.

---

## 3. Quy tắc xử lý

1. **Ưu tiên intent**: `search > suggest > compare > schedule > booking > pay > modify > cancel > history > other`.
2. **Keyword vs Semantic**:

   - Keyword trùng khớp → `keyword_override=true`.
   - Semantic chỉ override nếu confidence ≥ 0.95.

3. **Confidence slots**: Mỗi slot có:

```json
{ "value", "canonical", "confidence", "source", "raw", "operator" }
```

4. **Thời gian / ngày**:

```json
"time": { "from": "HH:MM" | null, "to": "HH:MM" | null },
"date": { "day": int|null, "month": int|null, "year": int|null }
```

5. **Giá**:

```json
"price_range": {
  "value": { "min": number|null, "max": number|null },
  "canonical": "low"|"medium"|"high"|null,
  "confidence": 0.0,
  "source": "",
  "raw": ""
}
```

6. **Địa điểm**:

```json
"location": { "value", "canonical": { "lat": number, "lon": number, "district": string|null }, "confidence", "source", "raw" }
```

7. **Yêu cầu làm rõ**:

   - Nếu critical slot thiếu hoặc confidence < 0.6 → `nlp_meta.clarify_required = true`.

---

## 4. Ví dụ

**User:** `"Tôi muốn ăn sushi ở quận 1, ngân sách 200-400k"`

**Output:**

```json
[
  {
    "intent": "search",
    "type": "reply",
    "entities": "restaurant",
    "fields": {
      "query": {
        "value": null,
        "canonical": null,
        "confidence": 0.0,
        "source": null,
        "raw": null
      },
      "cuisine": {
        "value": ["sushi"],
        "canonical": ["japanese_sushi"],
        "confidence": 0.95,
        "source": "semantic",
        "raw": "sushi"
      },
      "location": {
        "value": "quận 1",
        "canonical": { "district": "Quan 1" },
        "confidence": 0.9,
        "source": "rule",
        "raw": "quận 1"
      },
      "price_range": {
        "value": { "min": 200000, "max": 400000 },
        "canonical": "medium",
        "confidence": 0.9,
        "source": "user",
        "raw": "200-400k"
      },
      "filters": null
    },
    "intent_confidence": 0.96,
    "nlp_meta": {
      "keyword_override": false,
      "clarify_required": false,
      "missing_slots": [],
      "low_confidence_slots": []
    }
  }
]
```

# JSON Schema Documentation for Restaurant AI (OLD)

Dưới đây là mô tả chi tiết file JSON schema dùng cho hệ thống AI phân tích ý định người dùng trong ứng dụng nhà hàng. File này định nghĩa **intent, entity, type, fields** mà AI có thể trích xuất hoặc thao tác.

---

## 1. Structure Overview

- **intent_definitions**: danh sách các intent mà AI nhận diện.

  - **intent**: tên intent (search, booking, pay, suggest, schedule, compare).
  - **entities**: danh sách entities liên quan đến intent.
  - **type**: loại hành vi:

    - `ui_action` → thao tác UI (mở danh sách, menu, QR, đặt bàn…)
    - `reply` → trả về thông tin cho người dùng
    - `no_response` → intent không cần trả lời (hiện tại chưa sử dụng)

  - **fields**: các thuộc tính có thể trích xuất từ câu hỏi người dùng hoặc cần cho hành vi.

---

## 2. Intent Details

### 2.1 search

- **Entities**: restaurant, food, menu
- **Type**: ui_action, reply
- **Fields**:

  - `name` (string/null) – tên món/quán
  - `price` (integer/null) – giá, ngân sách
  - `utils` (list/null) – tiện ích: wifi, parking…
  - `type` (string/null) – loại món/quán
  - `rating` (float/null) – đánh giá
  - `distance` (string/null) – khoảng cách
  - `price_level` (string/null) – giá rẻ/trung bình/cao
  - `open_hours` (object) – giờ mở cửa: `{from, to}`
  - `time_of_day` (string/null) – bữa sáng/trưa/tối, mapping với `open_hours`

### 2.2 booking

- **Entities**: table
- **Type**: ui_action
- **Fields**:

  - `time` `{from, to}` – thời gian đặt bàn
  - `people` (integer/null) – số người
  - `res_name` (string/null) – tên nhà hàng
  - `special_request` (string/null) – yêu cầu đặc biệt
  - `contact` (string/null) – thông tin liên hệ

### 2.3 pay

- **Entities**: payment
- **Type**: ui_action
- **Fields**:

  - `type` (string/null) – loại thanh toán (QR, thẻ, ví…)
  - `amount` (integer/null) – số tiền
  - `id` (string/null) – ID hóa đơn hoặc đơn hàng
  - `note` (string/null) – ghi chú thanh toán
  - `res_name` (string/null) – tên quán

### 2.4 suggest

- **Entities**: restaurant, food
- **Type**: reply, ui_action
- **Fields**:

  - `taste` (string/null) – vị món ăn
  - `cuisine` (string/null) – loại ẩm thực
  - `location` (string/null) – khu vực, địa điểm
  - `price` (integer/null) – ngân sách
  - `res_name` (string/null) – tên quán tham chiếu
  - `time_of_day` (string/null) – bữa sáng/trưa/tối
  - `occasion` (string/null) – dịp (hẹn hò, sinh nhật…)
  - `popularity` (string/null) – mức phổ biến

### 2.5 schedule

- **Entities**: restaurant, table
- **Type**: ui_action, reply
- **Fields**:

  - `time` `{from, to}` – thời gian
  - `date` `{day, month, year}` – ngày, tháng, năm
  - `people` (integer/null) – số người
  - `reminder` (string/null) – cách nhắc nhở
  - `occasion` (string/null) – dịp

### 2.6 compare

- **Entities**: restaurant
- **Type**: reply
- **Fields**:

  - `res_name` ([string]) – danh sách quán cần so sánh
  - `criteria` ([string/null]) – tiêu chí so sánh: giá, rating, tiện ích…
  - `location` (string/null) – khu vực nếu muốn so sánh quán gần nhau

---

## 3. Notes

- Mỗi **intent** chỉ chứa các **field khả thi trích từ câu hỏi người dùng**, tránh dư thừa thông tin.
- **Entities** định nghĩa đối tượng mà intent tác động.
- **Type** phân biệt giữa thao tác UI và trả lời thông tin.
- Các **fields** optional nếu user không nhắc → backend lấy từ context.
- Schema dễ mở rộng cho các intent, entity hoặc field mới mà không cần thêm intent riêng.
- File JSON này có thể dùng trực tiếp cho **prompt LLM**, **validate input**, hoặc **map dữ liệu từ user query**.

---
