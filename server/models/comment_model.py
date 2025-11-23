from pydantic import BaseModel

# Dùng cho API tạo bình luận (POST /comment/create)
class CreateCommentRequest(BaseModel):
    restaurant: str # ID nhà hàng
    rating: float
    comment: str

# Dùng cho API lấy bình luận (POST /comment/get)
class GetCommentRequest(BaseModel):
    restaurant_id: str