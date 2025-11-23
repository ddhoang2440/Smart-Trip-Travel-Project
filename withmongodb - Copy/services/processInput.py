from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any
import re

app = FastAPI()

class RestaurantQuery(BaseModel):
    """Model để lưu trữ kết quả phân tích"""
    name: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    amenities: Optional[list[str]] = None
    price_range: Optional[str] = None
    min_rating: Optional[float] = None
    max_distance: Optional[float] = None
    raw_query: str

class RuleBasedNLU:
    """Rule-based Natural Language Understanding cho tìm kiếm nhà hàng"""
    
    def __init__(self):
        # Định nghĩa các pattern và từ khóa
        self.restaurant_types = [
            "việt nam", "ý", "nhật", "hàn quốc", "trung hoa", "thái",
            "buffet", "lẩu", "nướng", "hải sản", "chay", "fastfood",
            "cafe", "bar", "pub", "pizza", "sushi", "phở", "bún"
        ]
        
        self.price_keywords = {
            "rẻ": "cheap",
            "bình dân": "cheap",
            "giá rẻ": "cheap",
            "vừa phải": "medium",
            "trung bình": "medium",
            "cao cấp": "expensive",
            "sang trọng": "expensive",
            "đắt": "expensive",
            "luxury": "expensive"
        }
        
        self.amenities_keywords = {
            "wifi": "wifi",
            "parking": "parking",
            "đỗ xe": "parking",
            "bãi đỗ": "parking",
            "điều hòa": "air_conditioning",
            "ngoài trời": "outdoor_seating",
            "sân vườn": "outdoor_seating",
            "giao hàng": "delivery",
            "ship": "delivery",
            "đặt bàn": "reservation",
            "live music": "live_music",
            "nhạc sống": "live_music",
            "view đẹp": "nice_view",
            "pet friendly": "pet_friendly",
            "thú cưng": "pet_friendly"
        }
        
        # Các từ chỉ địa điểm
        self.location_keywords = [
            "ở", "tại", "gần", "quanh", "khu vực", "quận", "phường",
            "đường", "near", "in", "at"
        ]
        
        # Pattern cho rating
        self.rating_pattern = re.compile(r"(\d+(?:\.\d+)?)\s*(?:sao|star|rating|đánh giá)")
        
        # Pattern cho khoảng cách
        self.distance_pattern = re.compile(r"(\d+(?:\.\d+)?)\s*(?:km|m|mét|ki[lô]?)")
    
    def extract_name(self, text: str) -> Optional[str]:
        """Trích xuất tên nhà hàng từ các pattern phổ biến"""
        # Pattern: "nhà hàng [tên]", "quán [tên]", "[tên] restaurant"
        '''([A-Za-zÀ-ỹ0-9\s]+?) ten nha hang va thuong ket thuc voi dia diem (?:ở|tại|gần|có|với)|$)'''
        name_patterns = [
            r"(?:nhà hàng|quán|tiệm|restaurant)\s+([A-Za-zÀ-ỹ0-9\s]+?)(?:\s+(?:ở|tại|gần|có|với)|$)",
            r"^([A-Za-zÀ-ỹ0-9\s]+?)\s+(?:restaurant|cafe|quán|nhà hàng)",
        ]
        # ham thu tung pattern, re.search(pattern, string, flags=0) re.IGNORECASE để không phân biệt hoa/thường

        for pattern in name_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None
    
    def extract_location(self, text: str) -> Optional[str]:
        """Trích xuất địa điểm"""
        for keyword in self.location_keywords:
            pattern = f"{keyword}\\s+([A-Za-zÀ-ỹ0-9\\s,]+?)(?:\\s+(?:có|với|giá|rating)|$)"
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                location = match.group(1).strip()
                # Loại bỏ các từ không liên quan
                location = re.sub(r"\s+(?:có|với|giá|rating|sao).*$", "", location, flags=re.IGNORECASE)
                return location.strip()
        return None
    
    def extract_type(self, text: str) -> Optional[str]:
        """Trích xuất loại nhà hàng"""
        text_lower = text.lower()
        for rest_type in self.restaurant_types:
            if rest_type in text_lower:
                return rest_type
        return None
    
    def extract_price_range(self, text: str) -> Optional[str]:
        """Trích xuất mức giá"""
        text_lower = text.lower()
        for keyword, price_level in self.price_keywords.items():
            if keyword in text_lower:
                return price_level
        return None
    
    def extract_amenities(self, text: str) -> Optional[list[str]]:
        """Trích xuất các tiện nghi"""
        text_lower = text.lower()
        found_amenities = []
        
        for keyword, amenity in self.amenities_keywords.items():
            if keyword in text_lower:
                if amenity not in found_amenities:
                    found_amenities.append(amenity)
        
        return found_amenities if found_amenities else None
    
    def extract_rating(self, text: str) -> Optional[float]:
        """Trích xuất rating tối thiểu"""
        match = self.rating_pattern.search(text)
        if match:
            return float(match.group(1))
        
        # Pattern khác: "trên 4 sao", "từ 4.5 sao"
        match = re.search(r"(?:trên|từ|>|>=)\s*(\d+(?:\.\d+)?)", text)
        if match:
            return float(match.group(1))
        
        return None
    
    def extract_distance(self, text: str) -> Optional[float]:
        """Trích xuất khoảng cách tối đa"""
        match = self.distance_pattern.search(text)
        if match:
            distance = float(match.group(1))
            # Chuyển đổi mét sang km nếu cần
            if "m" in match.group(0).lower() and "km" not in match.group(0).lower():
                distance = distance / 1000
            return distance
        
        return None
    
    def parse(self, text: str) -> RestaurantQuery:
        """Phân tích câu truy vấn và trích xuất thông tin"""
        # Chuẩn hóa text
        text = text.strip()
        
        # Trích xuất các thông tin
        result = RestaurantQuery(
            raw_query=text,
            name=self.extract_name(text),
            location=self.extract_location(text),
            type=self.extract_type(text),
            amenities=self.extract_amenities(text),
            price_range=self.extract_price_range(text),
            min_rating=self.extract_rating(text),
            max_distance=self.extract_distance(text)
        )
        
        return result

# Khởi tạo NLU engine
nlu_engine = RuleBasedNLU()

@app.get("/search")
async def search_restaurants(
    q: str = Query(..., description="Câu truy vấn tìm kiếm tự nhiên")
) -> Dict[str, Any]:
    """
    API tìm kiếm nhà hàng bằng ngôn ngữ tự nhiên
    
    Ví dụ:
    - "Tìm nhà hàng Ý gần Quận 1 có wifi"
    - "Quán lẩu giá rẻ ở Quận 3 có chỗ đỗ xe"
    - "Nhà hàng cao cấp có rating trên 4.5 sao"
    - "Tìm quán phở trong vòng 2km"
    """
    # Parse query
    parsed_query = nlu_engine.parse(q)
    
    # TODO: Thực hiện tìm kiếm trong database với các tham số đã parse
    # Ví dụ: results = db.query(Restaurant).filter(...)
    
    return {
        "success": True,
        "query": q,
        "parsed": parsed_query.model_dump(),
        "message": "Đã phân tích thành công câu truy vấn"
    }

@app.post("/search/advanced")
async def search_advanced(query: RestaurantQuery) -> Dict[str, Any]:
    """
    API tìm kiếm với structured query (cho client tự parse)
    """
    return {
        "success": True,
        "query": query.model_dump(),
        "message": "Nhận được structured query"
    }

# Test endpoint
@app.get("/test-nlu")
async def test_nlu():
    """Test các câu query mẫu"""
    test_queries = [
        "Tìm nhà hàng Ý gần Quận 1 có wifi và parking",
        "Quán lẩu giá rẻ ở Thủ Đức có điều hòa",
        "Nhà hàng cao cấp có rating trên 4.5 sao",
        "Tìm quán phở trong vòng 2km có giao hàng",
        "Buffet hải sản gần đây giá trung bình",
        "Quán cafe có view đẹp và nhạc sống ở Quận 7"
    ]
    
    results = []
    for query in test_queries:
        parsed = nlu_engine.parse(query)
        results.append({
            "query": query,
            "parsed": parsed.model_dump()
        })
    
    return {"test_results": results}
'''FE có thể chọn dùng GET + query (/search?q=...) nếu muốn đơn giản và truyền ít tham số.
FE cũng có thể parse câu VN thành JSON rồi gửi POST tới /search/advanced nếu đã build sẵn parser — tùy cách bạn thiết kế app.
/search?q=... là một request GET với query parameter, không phải JSON body.'''
'''get Tham số ngắn, số lượng field ít → ví dụ: cuisine, location -)Dễ cache, bookmark, RESTful chuẩn
post Tham số phức tạp, nhiều field → ví dụ: cuisine, budget, rating, amenities, distance -)Không giới hạn độ dài, tổ chức JSON dễ hơn, private info
Nếu search phức tạp, nhiều tham số → POST /search/advanced (FE parse input thành JSON rồi gửi)
Khi dùng PUT:
Muốn chắc chắn rằng resource được “overwrite” hoàn toàn.
Thường dùng trong update form đầy đủ, admin panel, hoặc khi sync dữ liệu từ client.
Khi client chỉ cần update một số field.
Tránh phải gửi toàn bộ JSON (tiện lợi cho mobile app hoặc frontend).
PUT: admin cập nhật thông tin nhà hàng sau khi import dữ liệu từ file Excel → gửi tất cả trường.
admin muốn thêm một nhà hàng mới để người dùng có thể search:

Admin vào giao diện Admin Panel của app.
Điền thông tin nhà hàng: tên, loại món, địa chỉ, amenities, giá, rating mặc định…
FE (frontend) chuyển thông tin này thành JSON request.'''
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)