from beanie import PydanticObjectId
from beanie.operators import In
from typing import List

from entities.comment_entity import CommentEntity
from entities.user_entity import UserEntity

class CommentService:

    # =========================================================================
    # 1. CREATE COMMENT
    # =========================================================================
    @staticmethod
    async def create_comment(user_id: PydanticObjectId, restaurant_id: str, content: str):
        try:
            # Node logic: const newComment = { user_id, restaurant_id, content };
            new_comment = CommentEntity(
                user_id=user_id,
                restaurant_id=PydanticObjectId(restaurant_id),
                content=content
            )
            await new_comment.insert()

            return {"success": True, "message": "Create Comment Successfully !"}

        except Exception as e:
            print(f"Create comment error: {str(e)}")
            return {"success": False, "message": str(e)}

    # =========================================================================
    # 2. GET COMMENT (Có Populate User)
    # =========================================================================
    @staticmethod
    async def get_comment(restaurant_id: str):
        try:
            # 1. Tìm comment theo restaurant_id và sắp xếp mới nhất trước
            # Node: .find({restaurant_id}).sort({createdAt: -1})
            res_obj_id = PydanticObjectId(restaurant_id)
            comments = await CommentEntity.find(
                CommentEntity.restaurant_id == res_obj_id
            ).sort("-created_at").to_list()

            if not comments:
                return {"success": True, "message": "Get Comment Successfully !", "data": []}

            # 2. POPULATE USER_ID (Giống populate("user_id"))
            
            # Lấy danh sách ID user
            user_ids = list(set([c.user_id for c in comments]))
            users = await UserEntity.find(In(UserEntity.id, user_ids)).to_list()
            user_map = {u.id: u for u in users}

            # Ghép data
            result_list = []
            for c in comments:
                c_dict = c.dict()
                
                # Map _id và createdAt cho Frontend
                c_dict["_id"] = str(c.id)
                if c.created_at: c_dict["createdAt"] = c.created_at.isoformat()

                # Populate user info vào field 'user_id' (để khớp frontend đang gọi .user_id.username)
                if c.user_id in user_map:
                    u = user_map[c.user_id]
                    c_dict["user_id"] = {
                        "_id": str(u.id),
                        "username": u.username,
                        "image": u.image,
                        # Thêm các field khác nếu cần
                    }
                
                result_list.append(c_dict)

            return {"success": True, "message": "Get Comment Successfully !", "data": result_list}

        except Exception as e:
            print(f"Get comment error: {str(e)}")
            return {"success": False, "message": str(e)}