import os
import google.generativeai as genai
from dotenv import load_dotenv

# Import các Entity để lấy dữ liệu
from entities.restaurant_entity import RestaurantEntity
# from entities.menu_entity import MenuEntity (Có thể mở rộng sau nếu muốn tư vấn món cụ thể)

# 1. Load biến môi trường
load_dotenv()

# 2. Lấy Key và Cấu hình
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class ChatService:
    @staticmethod
    async def get_response(user_message: str):
        if not api_key:
            return {"success": False, "message": "Server chưa cấu hình API Key!"}

        try:
            # === BƯỚC 1: LẤY DỮ LIỆU TỪ DB ===
            # Lấy danh sách nhà hàng (Giới hạn 20 quán tiêu biểu để không bị quá tải token)
            restaurants = await RestaurantEntity.find_all().limit(20).to_list()
            
            # Chuyển dữ liệu thành văn bản để "dạy" cho AI
            # Chúng ta sẽ tạo một đoạn văn mô tả các quán ăn
            data_context = "Dưới đây là danh sách các nhà hàng hiện có trong hệ thống:\n"
            
            if not restaurants:
                data_context += "(Hiện chưa có dữ liệu nhà hàng nào).\n"
            else:
                for r in restaurants:
                    # Format: - Tên quán (Loại: ..., Giá TB: ..., Đánh giá: ... sao, Địa chỉ: ...)
                    info = f"- {r.name} (Loại: {r.type}, Giá TB: {r.medium_price}đ, Đánh giá: {r.rating}/5 sao, Địa chỉ: {r.address})"
                    data_context += info + "\n"

            # === BƯỚC 2: TẠO PROMPT (KỊCH BẢN) ===
            system_instruction = f"""
            Bạn là trợ lý ảo thông minh (AI Concierge) của ứng dụng 'Food Travel'.
            Nhiệm vụ của bạn là tư vấn ăn uống, đặt bàn cho khách hàng dựa trên dữ liệu thực tế.

            QUY TẮC QUAN TRỌNG:
            1. CHỈ được tư vấn các quán có trong danh sách dữ liệu bên dưới. Nếu khách hỏi quán không có trong danh sách, hãy lịch sự nói rằng hệ thống chưa cập nhật quán đó.
            2. Trả lời ngắn gọn, súc tích, giọng điệu vui vẻ, thân thiện, sử dụng emoji 🍕🍱.
            3. Nếu khách hỏi chung chung (ví dụ: "ăn gì ngon"), hãy gợi ý 2-3 quán có đánh giá cao nhất trong danh sách.
            4. Dùng Tiếng Việt 100%.

            {data_context}
            """
            
            # === BƯỚC 3: GỌI GEMINI ===
            # Dùng model mới nhất bạn có
            model = genai.GenerativeModel('models/gemini-2.5-flash')
            
            # Ghép ngữ cảnh + câu hỏi của khách
            full_prompt = f"{system_instruction}\n\nKhách hàng hỏi: {user_message}\nTrợ lý trả lời:"
            
            response = await model.generate_content_async(full_prompt)
            
            return {"success": True, "reply": response.text}

        except Exception as e:
            print(f"Gemini Error: {e}")
            # Fallback nếu lỗi: trả lời chung chung hoặc báo lỗi
            return {"success": False, "message": "AI đang bận xíu, bạn thử lại sau nhé!"}