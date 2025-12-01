import re
from typing import Optional, List
from models.search_model import ParsedQuery

class RuleBasedNLU:
    def __init__(self):
        # Danh sách từ khóa để nhận diện Loại món
        self.restaurant_types = [
            "việt nam", "ý", "nhật", "hàn quốc", "trung hoa", "thái",
            "buffet", "lẩu", "nướng", "hải sản", "chay", "fastfood", 
            "pizza", "sushi", "phở", "cơm", "bún", "trà sữa", "cafe", "mì"
        ]
        
        # Danh sách từ khóa để nhận diện Mức giá
        self.price_keywords = {
            "rẻ": "cheap", "bình dân": "cheap", "sinh viên": "cheap",
            "vừa": "medium", "trung bình": "medium", "hợp lý": "medium",
            "sang": "expensive", "cao cấp": "expensive", "đắt": "expensive", "xịn": "expensive"
        }
        
        # Danh sách từ khóa để nhận diện Tiện ích (Amenities)
        self.amenities_keywords = {
            "wifi": "wifi", "parking": "parking", "đỗ xe": "parking", "gửi xe": "parking",
            "điều hòa": "air_conditioning", "máy lạnh": "air_conditioning",
            "ngoài trời": "outdoor_seating", "view": "nice_view"
        }
        
        # Từ khóa chỉ dẫn Địa điểm
        self.location_keywords = ["ở", "tại", "gần", "khu vực", "quận", "phường", "đường", "trong"]
        
        # Regex tìm Rating (VD: 4.5 sao, 5 star)
        self.rating_pattern = re.compile(r"(\d+(?:\.\d+)?)\s*(?:sao|star)")

    def _extract_from_list(self, text: str, source_list: list) -> Optional[str]:
        text_lower = text.lower()
        for item in source_list:
            if item in text_lower: return item
        return None

    def _extract_from_dict(self, text: str, source_dict: dict) -> Optional[str]:
        text_lower = text.lower()
        for key, value in source_dict.items():
            if key in text_lower: return value
        return None

    def parse(self, text: str) -> ParsedQuery:
        if not text:
            return ParsedQuery(raw_query="")

        text = text.strip()
        
        # 1. Trích xuất Loại món (Type)
        res_type = self._extract_from_list(text, self.restaurant_types)
        
        # 2. Trích xuất Mức giá (Price Range)
        price = self._extract_from_dict(text, self.price_keywords)
        
        # 3. Trích xuất Tiện ích (Amenities)
        amenities = []
        for k, v in self.amenities_keywords.items():
            if k in text.lower(): amenities.append(v)
            
        # 4. Trích xuất Địa điểm (Location)
        location = None
        for kw in self.location_keywords:
            # Regex tìm chuỗi sau từ khóa địa điểm
            # Pattern này hỗ trợ Tiếng Việt có dấu
            pattern = f"{kw}\\s+([a-zA-Z0-9\\s,àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+)"
            match = re.search(pattern, text, re.IGNORECASE)
            if match: 
                raw_loc = match.group(1).strip()
                # Cắt bớt chuỗi nếu dính các từ khóa chức năng khác
                for stop_word in ["có", "với", "giá", "món", "loại", "tầm"]:
                    if f" {stop_word} " in f" {raw_loc} ":
                        raw_loc = raw_loc.split(f" {stop_word} ")[0]
                location = raw_loc
                break

        # 5. Trích xuất Rating
        rating_match = self.rating_pattern.search(text)
        min_rating = float(rating_match.group(1)) if rating_match else None

        # 6. Trả về kết quả
        # name=None vì ta sẽ dùng raw_query làm keyword tìm kiếm chung trong Service
        return ParsedQuery(
            raw_query=text,
            name=None, 
            type=res_type,
            price_range=price,
            amenities=amenities if amenities else None,
            location=location,
            min_rating=min_rating
        )