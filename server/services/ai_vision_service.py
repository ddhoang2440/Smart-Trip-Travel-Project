import os
import io
import json
import re
import google.generativeai as genai
from PIL import Image
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

class AIVisionService:
    
    @staticmethod
    async def predict_food_from_image(image_data: bytes) -> str:
        if not api_key:
            print("Lỗi: Chưa có GEMINI_API_KEY")
            return None

        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('models/gemini-2.5-flash')
            
            image = Image.open(io.BytesIO(image_data))
            
            print("Đang phân tích ảnh kỹ hơn...")
            
            # [NÂNG CẤP PROMPT] Yêu cầu suy luận trước khi kết luận
            prompt = """
            Bạn là chuyên gia ẩm thực tinh tường. Hãy phân tích bức ảnh món ăn này thật kỹ.
            
            Yêu cầu phân tích:
            1. Quan sát lớp vỏ, hình dáng và các chi tiết nhỏ (ví dụ: đuôi tôm, thớ thịt, màu sắc bên trong).
            2. Phân biệt kỹ các món dễ nhầm lẫn (VD: Tôm chiên vs Xúc xích, Gà rán vs Cá chiên).
            3. Sắp xếp theo độ tin cậy giảm dần.

            Trả về kết quả định dạng JSON duy nhất:
            {
                "candidates": ["Tên món dự đoán 1", "Tên món dự đoán 2", "Tên món dự đoán 3"],
                "reasoning": "Giải thích ngắn gọn tại sao bạn chọn các món này"
            }
            """
            
            response = await model.generate_content_async([prompt, image])
            text = response.text.strip()
            
            # Xử lý JSON trả về (phòng trường hợp AI thêm ```json)
            if text.startswith("```"):
                text = re.sub(r"^```json|^```", "", text).strip()
                text = re.sub(r"```$", "", text).strip()

            data = json.loads(text)
            
            candidates = data.get("candidates", [])           
            reasoning = data.get("reasoning", "")
            
            print(f"Suy luận: {reasoning}")
            print(f"Các dự đoán: {candidates}")
            
            # Lọc bỏ kết quả rác
            clean_candidates = [
                c for c in candidates 
                if c and "không phải món ăn" not in c.lower()
            ]
                
            return clean_candidates

        except Exception as e:
            print(f"AI Vision Error: {e}")
            return []