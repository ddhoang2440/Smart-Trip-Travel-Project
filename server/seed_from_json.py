import asyncio
import json
import os
import sys
import time
import re
import google.generativeai as genai
from dotenv import load_dotenv

# Thêm đường dẫn để import module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database import init_db
from entities.user_entity import UserEntity
from entities.restaurant_entity import RestaurantEntity
from entities.menu_entity import MenuEntity
from config.security import hash_password

# Cấu hình Gemini
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
has_ai = False

if api_key:
    genai.configure(api_key=api_key)
    try:
        model = genai.GenerativeModel('models/gemini-2.5-flash')
        has_ai = True
    except:
        print("⚠️ Không tìm thấy model AI, sẽ chạy chế độ offline.")

# Hàm hỏi AI: Lấy cả Nguyên liệu và Mô tả
async def get_food_info_from_ai(food_name):
    global has_ai
    # Giá trị mặc định nếu lỗi
    default_res = {"ingredients": [], "description": f"Món {food_name} thơm ngon, hấp dẫn."}
    
    if not has_ai: return default_res
    
    try:
        print(f"   🤖 Đang hỏi Gemini về: {food_name}...", end=" ")
        
        # [CẬP NHẬT PROMPT] Yêu cầu JSON, min 3 nguyên liệu, có mô tả
        prompt = f"""
        Phân tích món ăn: "{food_name}".
        Hãy trả về kết quả KHÔNG dùng Markdown, chỉ trả về đúng định dạng JSON thuần túy như sau:
        {{
            "ingredients": ["Nguyên liệu 1", "Nguyên liệu 2", "Nguyên liệu 3", ...],
            "description": "Viết 1 câu mô tả ngắn gọn (dưới 8 từ) thật hấp dẫn về hương vị món này."
        }}
        Yêu cầu:
        - "ingredients": Phải có ÍT NHẤT 3 nguyên liệu quan trọng nhất.
        - Dùng Tiếng Việt chuẩn.
        """
        
        response = await model.generate_content_async(prompt)
        text = response.text.strip()
        
        # Xử lý nếu AI trả về markdown ```json ... ```
        if text.startswith("```"):
            text = re.sub(r"^```json|^```", "", text).strip()
            text = re.sub(r"```$", "", text).strip()

        data = json.loads(text)
        
        # Chuẩn hóa dữ liệu
        ing_list = [i.strip().capitalize() for i in data.get("ingredients", [])]
        desc = data.get("description", default_res["description"])
        
        print("✅ Xong.")
        time.sleep(4) # Nghỉ 4s tránh lỗi Quota
        
        return {"ingredients": ing_list, "description": desc}

    except Exception as e:
        if "429" in str(e):
            print(f"\n❌ Hết Quota! Dừng AI.")
            has_ai = False 
        else:
            print(f"\n⚠️ Lỗi AI: {e}")
        return default_res

def convert_price_level(level):
    level = str(level).lower()
    if "cheap" in level: return 50000
    if "medium" in level: return 150000
    if "expensive" in level: return 500000
    return 100000 

async def seed_data():
    print("🚀 BẮT ĐẦU IMPORT DỮ LIỆU (CÓ MÔ TẢ & NGUYÊN LIỆU AI)...")
    await init_db()
    
    try:
        # Tạo Admin
        admin_user = await UserEntity.find_one(UserEntity.email == "admin_ai@gmail.com")
        if not admin_user:
            admin_user = UserEntity(
                username="Admin AI", email="admin_ai@gmail.com", 
                password=hash_password("123456"), image="", contact="0909000111"
            )
            await admin_user.insert()
        
        # Đọc JSON
        json_path = os.path.join(os.path.dirname(__file__), "restaurants_updated (3).json")
        if not os.path.exists(json_path):
            print("❌ Không thấy file JSON")
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)

        count_res = 0
        count_menu = 0

        for item in raw_data:
            r_data = item.get("restaurant", {})
            details = r_data.get("details", {})
            
            # Tạo Nhà hàng
            print(f"\n🏠 {r_data.get('name')}")
            new_restaurant = RestaurantEntity(
                name=r_data.get("name"),
                type=r_data.get("type", "General"),
                owner=admin_user.id,
                images=[r_data.get("image")] if r_data.get("image") else [],
                address=details.get("address", "Unknown"),
                from_time=details.get("opening_hours", {}).get("from", "08:00"),
                to_time=details.get("opening_hours", {}).get("to", "22:00"),
                rating=float(r_data.get("rating", 0)),
                review=int(r_data.get("review_count", 0)),
                medium_price=convert_price_level(r_data.get("price_level")),
                description=f"Nhà hàng {r_data.get('name')} chuyên về {r_data.get('type')}."
            )
            saved_res = await new_restaurant.insert()
            count_res += 1
            
            # Tạo Menu
            menu_list = details.get("menu", [])
            for dish in menu_list:
                food_name = dish.get("food_name", "")
                final_ingredients = set()
                final_description = dish.get("description") # Lấy mô tả gốc nếu có
                
                # 1. Lấy nguyên liệu có sẵn trong JSON
                raw_ingredients = dish.get("allergy_info", [])
                has_json_data = False
                
                if isinstance(raw_ingredients, list) and len(raw_ingredients) > 0:
                    for ing in raw_ingredients:
                        for item in ing.split(","): 
                            final_ingredients.add(item.strip().title())
                    has_json_data = True
                elif isinstance(raw_ingredients, str) and raw_ingredients.strip():
                     final_ingredients.add(raw_ingredients.strip().title())
                     has_json_data = True

                # 2. Hỏi AI để lấy thêm: Nguyên liệu + Mô tả (nếu thiếu)
                if has_ai:
                    ai_data = await get_food_info_from_ai(food_name)
                    
                    # Bổ sung nguyên liệu
                    for item in ai_data["ingredients"]:
                        final_ingredients.add(item)
                    
                    # Bổ sung mô tả nếu JSON gốc không có
                    if not final_description:
                        final_description = ai_data["description"]

                # Tạo Món
                new_menu = MenuEntity(
                    name=food_name,
                    price=float(dish.get("price", 0)),
                    # [CẬP NHẬT] Dùng mô tả xịn từ AI
                    description=final_description or f"Món {food_name} tuyệt hảo!",
                    ingredient=list(final_ingredients),
                    restaurant=saved_res.id,
                    image=r_data.get("image") 
                )
                await new_menu.insert()
                count_menu += 1

        print(f"\n🎉 HOÀN TẤT! Thêm {count_res} quán, {count_menu} món.")

    except Exception as e:
        print(f"❌ LỖI CHUNG: {e}")


if __name__ == "__main__":
    asyncio.run(seed_data())