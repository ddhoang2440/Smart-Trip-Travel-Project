import uuid
from beanie import PydanticObjectId
from typing import List

from entities.order_entity import OrderEntity, OrderItem
from entities.menu_entity import MenuEntity
from entities.voucher_entity import VoucherEntity

class OrderService:
    @staticmethod
    async def create_order(user_id: PydanticObjectId, items_req: List, voucher_code: str = None, address = "", contact = ""):
        try:
            # 1. Tính tổng tiền gốc từ DB
            total_price = 0
            order_items = []

            for item in items_req:
                # Tìm món ăn để lấy giá gốc
                menu = await MenuEntity.get(PydanticObjectId(item.menu))
                if not menu: continue # Bỏ qua nếu món không tồn tại
                
                line_price = menu.price * item.quantity
                total_price += line_price
                
                order_items.append(OrderItem(
                    menu_id=menu.id,
                    restaurant_id=PydanticObjectId(item.restaurant),
                    name=menu.name,
                    price=menu.price,
                    quantity=item.quantity,
                    status="PENDING"
                ))
            
            if not order_items:
                return {"success": False, "message": "Order is empty!"}

            # 2. Áp dụng Voucher (Nếu có)
            discount_amount = 0
            
            if voucher_code:
                # Tìm mã (chuyển về chữ hoa)
                voucher = await VoucherEntity.find_one(VoucherEntity.code == voucher_code.upper())
                
                # Check điều kiện: Có tồn tại và Còn lượt dùng
                if voucher and voucher.limit > 0:
                    # Tính tiền giảm
                    if voucher.type == "PERCENT":
                        discount_amount = total_price * (voucher.discount / 100)
                    else: # AMOUNT
                        discount_amount = voucher.discount
                    
                    # Không giảm quá số tiền gốc (tránh âm tiền)
                    if discount_amount > total_price:
                        discount_amount = total_price

                    # [QUAN TRỌNG] Trừ 1 lượt dùng
                    voucher.limit -= 1
                    await voucher.save()
                else:
                    return {"success": False, "message": "Voucher invalid or expired!"}

            final_price = total_price - discount_amount

            # 3. Lưu đơn hàng
            new_order = OrderEntity(
                user=user_id,
                items=order_items,
                total_price=total_price,
                voucher_code=voucher_code,
                discount_amount=discount_amount,
                final_price=final_price,
                address=address, 
                contact=contact
            )
            await new_order.insert()

            return {
                "success": True, 
                "message": "Order created successfully!", 
                "order": new_order
            }

        except Exception as e:
            print(f"Order Error: {e}")
            return {"success": False, "message": "Create Order Failed!"}
    @staticmethod
    async def get_orders_by_restaurant(restaurant_id: str):
        try:
            orders = await OrderEntity.find(
                OrderEntity.items.restaurant_id == PydanticObjectId(restaurant_id)
            ).to_list()

            result_items = []
            for order in orders:
                for item in order.items:
                    if str(item.restaurant_id) == restaurant_id:
                        result_items.append({
                            "order_id": str(order.id),
                            "name": item.name,
                            "price": item.price,
                            "quantity": item.quantity,
                            "status": order.status,
                            "restaurant_id": str(item.restaurant_id),
                            "id": item.id,
                        })

            return {
                "success": True,
                "items": result_items
            }

        except Exception as e:
            print("Get order items error:", e)
            return {"success": False, "message": "Get failed!"}       
    # @staticmethod
    # async def get_user_orders(user_id: PydanticObjectId):
    #     try:
    #         # Tìm tất cả đơn hàng của user, sắp xếp mới nhất trước
    #         orders = await OrderEntity.find(
    #             OrderEntity.user == user_id
    #         ).sort("-created_at").to_list()
            
    #         if not orders:
    #             return {"success": True, "message": "No orders found", "orders": []}

    #         # Format dữ liệu trả về (Convert ObjectId -> String, Datetime -> String)
    #         order_list = []
    #         for order in orders:
    #             order_dict = order.dict()
    #             order_dict["_id"] = str(order.id) # Frontend cần _id
    #             order_dict["created_at"] = order.created_at.strftime("%d/%m/%Y %H:%M") # Format ngày đẹp
    #             order_list.append(order_dict)

    #         return {
    #             "success": True, 
    #             "message": "Get user orders successfully!", 
    #             "orders": order_list
    #         }
    #     except Exception as e:
    #         print(f"Get orders error: {e}")
    #         return {"success": False, "message": "Get user orders failed!"}
    @staticmethod
    async def get_user_orders(user_id: PydanticObjectId):
        try:
            print("user_id =", user_id, type(user_id))

            orders = await OrderEntity.find(
                OrderEntity.user == user_id
            ).sort(
                "created_at"
            ).to_list()

            if not orders:
                return {
                    "success": True,
                    "message": "No orders found",
                    "orders": []
                }

            order_list = []
            for order in orders:
                # Dùng model_dump + by_alias=True → tự động có _id, không cần thêm tay
                data = order.model_dump(by_alias=True)

                # Format ngày đẹp (nếu bạn chưa dùng json_encoders trong entity)
                data["created_at"] = order.created_at.strftime("%d/%m/%Y %H:%M")

                # Quan trọng: xử lý items để frontend nhận đúng _id (string)
                formatted_items = []
                for item in order.items:
                    item_data = item.model_dump(by_alias=True)
                    # Nếu bạn đã dùng alias="_id" trong OrderItem → item_data đã có "_id"
                    # Nếu chưa thì thêm dòng dưới:
                    item_data["_id"] = str(item.id)
                    formatted_items.append(item_data)
                
                data["items"] = formatted_items
                order_list.append(data)

            return {
                "success": True,
                "message": "Get user orders successfully!",
                "orders": order_list
            }

        except Exception as e:
            print("user_id =", user_id, type(user_id))
            print(f"Get user orders error: {e}")
            return {"success": False, "message": "Get user orders failed!"}
    @staticmethod
    async def update_order_item_status(item_id: str, status: str):
        try:

            # Tìm order chứa item này
            order = await OrderEntity.find_one(
                OrderEntity.items.id == item_id
            )
            if not order:
                return {"success": False, "message": "Order not found"}

            # Update item
            for item in order.items:
                if item.id == item_id:
                    item.status = status

            # Nếu tất cả item đều SUCCESS -> cập nhật order thành SUCCESS
            if all(i.status == "COMPLETED" for i in order.items):
                order.status = "COMPLETED"
            if all(i.status == "CANCELED" for i in order.items):
                order.status = "CANCELED"
            await order.save()

            return {"success": True, "message": "Item updated!"}
        except Exception as e:
            print(e)
            return {"success": False, "message": "Update failed!"}
